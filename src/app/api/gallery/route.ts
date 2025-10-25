import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function replaceUrlBase(url: string, supabaseUrl: string): string {
  if (url.startsWith("http://localhost:8000")) {
    return url.replace("http://localhost:8000", supabaseUrl.replace(/\/$/, ''));
  }
  return url;
}

async function uploadImage(image: File, supabase: SupabaseClient): Promise<string | null> {
  const id = uuidv4();
  const fileExt = image.name.split(".").pop();
  const fileName = `${id}.${fileExt}`;
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage.from("images").upload(fileName, buffer, {
    contentType: image.type,
  });

  if (uploadError) {
    console.error("Upload Error:", uploadError);
    return null;
  }

  const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
  return replaceUrlBase(publicUrlData.publicUrl, process.env.NEXT_PUBLIC_SUPABASE_URL!);
}

export async function POST(req: NextRequest) {
  try {
    // @ts-ignore AuthOptions Error
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageFiles = formData.getAll("images") as File[];
    const coverImageIndex = parseInt(formData.get("coverImageIndex") as string || "0");
    
    let locations: string[] = [];
    const locationsStr = formData.get("locations") as string;
    if (locationsStr) {
      try {
        locations = JSON.parse(locationsStr);
      } catch (e) {
        console.error("Error parsing locations:", e);
      }
    }

    if (!title || !description || imageFiles.length === 0) {
      return NextResponse.json({ error: "Title, description, and at least one image are required" }, { status: 400 });
    }

    const { data: galleryData, error: galleryError } = await supabase
      .from("galleries")
      .insert([{ title, description }])
      .select("id")
      .single();

    if (galleryError) {
      console.error("Gallery Insert Error:", galleryError);
      return NextResponse.json({ error: "Failed to create gallery" }, { status: 500 });
    }

    const galleryId = galleryData.id;

    const imageUrls = [];
    let coverImageId: string | null = null;

    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      const imageUrl = await uploadImage(imageFile, supabase);
      const location = locations[i] || "";

      if (imageUrl) {
        imageUrls.push(imageUrl);

        const { error: imageInsertError, data: imageData } = await supabase
          .from("gallery_images")
          .insert([{ 
            gallery_id: galleryId, 
            url: imageUrl, 
            is_cover_photo: i === coverImageIndex,
            location
          }])
          .select("id")
          .single();

        if (imageInsertError) {
          console.error("Image Insert Error:", imageInsertError);
          return NextResponse.json({ error: "Failed to save image metadata" }, { status: 500 });
        }

        if (i === coverImageIndex) {
          coverImageId = imageData.id;
        }
      }
    }

    if (coverImageId) {
      const { error: updateGalleryError } = await supabase
        .from("galleries")
        .update({ cover_image_id: coverImageId })
        .eq("id", galleryId);

      if (updateGalleryError) {
        console.error("Update Gallery Error:", updateGalleryError);
        return NextResponse.json({ error: "Failed to update gallery with cover image" }, { status: 500 });
      }
    }

    return NextResponse.json({ galleryId, title, description, imageUrls, coverImageId });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data: galleries, error: galleryError } = await supabase
      .from("galleries")
      .select("id, title, description, cover_image_id");

    if (galleryError) {
      console.error("Fetch Galleries Error:", galleryError);
      return NextResponse.json({ error: "Failed to fetch galleries" }, { status: 500 });
    }

    const galleriesWithImages = await Promise.all(
      galleries.map(async (gallery) => {
        const { data: images, error: imagesError } = await supabase
          .from("gallery_images")
          .select("id, url, is_cover_photo, location")
          .eq("gallery_id", gallery.id);

        if (imagesError) {
          console.error("Fetch Images Error:", imagesError);
          return { ...gallery, images: [], error: "Failed to fetch images for gallery" };
        }

        // Replace localhost URLs with Supabase URLs in images
        const imagesWithUpdatedUrls = images.map(image => ({
          ...image,
          url: replaceUrlBase(image.url, process.env.NEXT_PUBLIC_SUPABASE_URL!)
        }));

        return { ...gallery, images: imagesWithUpdatedUrls };
      })
    );

    return NextResponse.json(galleriesWithImages);
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // @ts-ignore AuthOptions Error
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data: galleryImages, error: fetchImagesError } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("gallery_id", id);

    if (fetchImagesError) {
      console.error("Fetch Images Error:", fetchImagesError);
      return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
    }

    if (galleryImages && galleryImages.length > 0) {
      for (const image of galleryImages) {

        const filename = image.url.split('/').pop();
        
        if (filename) {
          const { error: deleteStorageError } = await supabase
            .storage
            .from('images')
            .remove([filename]);
            
          if (deleteStorageError) {
            console.error("Delete Storage Error:", deleteStorageError, "for image:", filename);
          }
        } else {
          console.error("Could not extract filename from URL:", image.url);
        }
      }
      
      const { error: deleteImagesError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("gallery_id", id);
        
      if (deleteImagesError) {
        console.error("Delete Images Error:", deleteImagesError);
        return NextResponse.json({ error: "Failed to delete image records" }, { status: 500 });
      }
    }

    const { error: deleteGalleryError } = await supabase.from("galleries").delete().eq("id", id);

    if (deleteGalleryError) {
      console.error("Delete Gallery Error:", deleteGalleryError);
      return NextResponse.json({ error: "Failed to delete gallery" }, { status: 500 });
    }

    return NextResponse.json({ message: "Gallery and associated images deleted successfully" });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // @ts-ignore AuthOptions Error
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const newImages = formData.getAll("newImages") as File[];
    const coverImageIndex = parseInt(formData.get("coverImageIndex") as string || "0");
    
    let locations: string[] = [];
    const locationsStr = formData.get("locations") as string;
    if (locationsStr) {
      try {
        locations = JSON.parse(locationsStr);
      } catch (e) {
        console.error("Error parsing locations:", e);
      }
    }

    const { data: existingGallery, error: galleryError } = await supabase
      .from("galleries")
      .select("title, description, cover_image_id")
      .eq("id", id)
      .single();

    if (galleryError || !existingGallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const updatedGallery = {
      title: title ?? existingGallery.title,
      description: description ?? existingGallery.description,
    };

    const { error: updateError } = await supabase.from("galleries").update(updatedGallery).eq("id", id);

    if (updateError) {
      console.error("Update Error:", updateError);
      return NextResponse.json({ error: "Failed to update gallery" }, { status: 500 });
    }

    const imageUrls = [];
    let coverImageId: string | null = null;

    for (let i = 0; i < newImages.length; i++) {
      const imageFile = newImages[i];
      const imageUrl = await uploadImage(imageFile, supabase);
      const location = locations[i] || "";

      if (imageUrl) {
        imageUrls.push(imageUrl);

        const { error: imageInsertError, data: imageData } = await supabase
          .from("gallery_images")
          .insert([{ 
            gallery_id: id, 
            url: imageUrl, 
            is_cover_photo: i === coverImageIndex,
            location
          }])
          .select("id")
          .single();

        if (imageInsertError) {
          console.error("Image Insert Error:", imageInsertError);
          return NextResponse.json({ error: "Failed to save new image metadata" }, { status: 500 });
        }
        if (i === coverImageIndex) {
          coverImageId = imageData.id;
        }
      }
    }

    if (coverImageId) {
      const { error: updateGalleryError } = await supabase
        .from("galleries")
        .update({ cover_image_id: coverImageId })
        .eq("id", id);

      if (updateGalleryError) {
        console.error("Update Gallery Error:", updateGalleryError);
        return NextResponse.json({ error: "Failed to update gallery with new cover image" }, { status: 500 });
      }
    }

    return NextResponse.json({ id, ...updatedGallery, imageUrls });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}