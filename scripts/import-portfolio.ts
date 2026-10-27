import fs from 'fs';
import path from 'path';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { prisma } from '../src/lib/db/prisma';

// Ensure Cloudinary is configured
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface PortfolioItem {
  title: string;
  category: 'Ecommerce' | 'Real Estate' | 'Web Design' | 'Branding';
  imageUrl: string;
  fileName: string;
  publicId: string;
  liveUrl: string;
}

const PORTFOLIO_PROJECTS: PortfolioItem[] = [
  {
    title: 'SmartShop',
    category: 'Ecommerce',
    imageUrl: 'https://mightywarner.com/assets/img/pot1.webp',
    fileName: 'pot1.webp',
    publicId: 'smartshop',
    liveUrl: 'https://the-smart-shop.com/',
  },
  {
    title: 'Luxury Akar',
    category: 'Real Estate',
    imageUrl: 'https://mightywarner.com/assets/img/pot2.webp',
    fileName: 'pot2.webp',
    publicId: 'luxury_akar',
    liveUrl: 'https://luxuryakar.ae/',
  },
  {
    title: 'Bantuuz.com',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/pot3.webp',
    fileName: 'pot3.webp',
    publicId: 'bantuuz',
    liveUrl: 'https://bantuuz.com/',
  },
  {
    title: 'Safety Shop Dubai',
    category: 'Ecommerce',
    imageUrl: 'https://mightywarner.com/assets/img/safetyshop.webp',
    fileName: 'safetyshop.webp',
    publicId: 'safetyshop_dubai',
    liveUrl: 'https://safetyshopdubai.com/',
  },
  {
    title: 'AlSadaf Pet Care',
    category: 'Ecommerce',
    imageUrl: 'https://mightywarner.com/assets/img/alsadaf.webp',
    fileName: 'alsadaf.webp',
    publicId: 'alsadaf_pet_care',
    liveUrl: 'https://alsadafpetcare.com/',
  },
  {
    title: 'TVG Realtors',
    category: 'Real Estate',
    imageUrl: 'https://mightywarner.com/assets/img/tvg.webp',
    fileName: 'tvg.webp',
    publicId: 'tvg_realtors',
    liveUrl: 'https://tvgrealtors.com/',
  },
  {
    title: 'White Sand',
    category: 'Real Estate',
    imageUrl: 'https://mightywarner.com/assets/img/pot4.webp',
    fileName: 'pot4.webp',
    publicId: 'white_sand',
    liveUrl: 'https://whitesand.ae/',
  },
  {
    title: 'Masar Ind.',
    category: 'Ecommerce',
    imageUrl: 'https://mightywarner.com/assets/img/pot5.webp',
    fileName: 'pot5.webp',
    publicId: 'masar_ind',
    liveUrl: 'https://masar-ind.com/',
  },
  {
    title: 'EIA',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/pot6.webp',
    fileName: 'pot6.webp',
    publicId: 'eia',
    liveUrl: 'https://www.eia.gov.ae/',
  },
  {
    title: 'Linda Paradis Group',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/pot7.webp',
    fileName: 'pot7.webp',
    publicId: 'linda_paradis_group',
    liveUrl: 'https://lindaparadisgroup.com/',
  },
  {
    title: 'Capital-Index',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/pot8.webp',
    fileName: 'pot8.webp',
    publicId: 'capital_index',
    liveUrl: 'https://capital-index.com/',
  },
  {
    title: 'TVG Consultancy',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/pot9.webp',
    fileName: 'pot9.webp',
    publicId: 'tvg_consultancy',
    liveUrl: 'https://www.tvgconsultancy.com/',
  },
  {
    title: 'Timeoutx',
    category: 'Ecommerce',
    imageUrl: 'https://mightywarner.com/assets/img/pot10.webp',
    fileName: 'pot10.webp',
    publicId: 'timeoutx',
    liveUrl: 'https://timeoutx.ae/',
  },
  {
    title: 'Pipelink',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/pot11.webp',
    fileName: 'pot11.webp',
    publicId: 'pipelink',
    liveUrl: 'http://www.pipelinktanks.com/',
  },
  {
    title: 'Stirlingls',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/pot12.webp',
    fileName: 'pot12.webp',
    publicId: 'stirlingls',
    liveUrl: 'https://stirlingls.com/',
  },
  {
    title: 'TheOdor',
    category: 'Ecommerce',
    imageUrl: 'https://mightywarner.com/assets/img/pot13.webp',
    fileName: 'pot13.webp',
    publicId: 'theodor',
    liveUrl: 'https://theodoronline.com/',
  },
  {
    title: 'HF Polyclinic',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/hfpoly.webp',
    fileName: 'hfpoly.webp',
    publicId: 'hf_polyclinic',
    liveUrl: 'https://hfpolyclinics.com/',
  },
  {
    title: 'Colour-Reflections',
    category: 'Branding',
    imageUrl: 'https://mightywarner.com/assets/img/color_refp.webp',
    fileName: 'color_refp.webp',
    publicId: 'colour_reflections',
    liveUrl: 'https://colour-reflections.com/',
  },
  {
    title: 'Bridgertongroup',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/port16.webp',
    fileName: 'port16.webp',
    publicId: 'bridgertongroup',
    liveUrl: 'https://bridgertongroup.com/',
  },
  {
    title: 'Biostream',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/port17.webp',
    fileName: 'port17.webp',
    publicId: 'biostream',
    liveUrl: 'http://biostream-uae.com/',
  },
  {
    title: 'South Wind Maritime Ltd',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/southwind.webp',
    fileName: 'southwind.webp',
    publicId: 'south_wind_maritime',
    liveUrl: 'https://southwind.biz/',
  },
  {
    title: 'Equinox globalGeneral Trading LLC',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/euinex.webp',
    fileName: 'euinex.webp',
    publicId: 'equinox_global',
    liveUrl: 'http://equinoxtradingllc.com/',
  },
  {
    title: 'Anatolia Tanboga General Trading LLC',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/anatolio.webp',
    fileName: 'anatolio.webp',
    publicId: 'anatolia_tanboga',
    liveUrl: 'http://anatoliageneraltrading.com/',
  },
  {
    title: 'Biladalsham',
    category: 'Web Design',
    imageUrl: 'https://mightywarner.com/assets/img/bilad.webp',
    fileName: 'bilad.webp',
    publicId: 'biladalsham',
    liveUrl: 'https://biladalsham.com/',
  },
];

async function uploadToCloudinary(buffer: Buffer, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mighty-warner/portfolio',
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No response from Cloudinary'));
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

async function main() {
  console.log('🚀 Starting Mighty Warner Portfolio Migration...');

  // 1. Ensure local download folder exists
  const localDir = path.join(process.cwd(), 'public', 'images', 'portfolio');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
    console.log(`📁 Created local folder: ${localDir}`);
  }

  // 2. Set up Category Manager in SiteSection
  const portfolioCategories = ['Ecommerce', 'Real Estate', 'Web Design', 'Branding'];
  await prisma.siteSection.upsert({
    where: {
      pageSlug_sectionKey: {
        pageSlug: 'work',
        sectionKey: 'categories',
      },
    },
    update: {
      title: 'TRUSTED ACROSS:',
      content: {
        categories: portfolioCategories,
        title: 'TRUSTED ACROSS:',
      },
    },
    create: {
      pageSlug: 'work',
      sectionKey: 'categories',
      name: 'Work Page Categories',
      title: 'TRUSTED ACROSS:',
      content: {
        categories: portfolioCategories,
        title: 'TRUSTED ACROSS:',
      },
    },
  });
  console.log(`✅ Category Manager updated with: ${portfolioCategories.join(', ')}`);

  // 3. Process each project
  let count = 0;
  for (let i = 0; i < PORTFOLIO_PROJECTS.length; i++) {
    const item = PORTFOLIO_PROJECTS[i];
    console.log(`\n[${i + 1}/${PORTFOLIO_PROJECTS.length}] Processing "${item.title}"...`);

    let finalImageUrl = item.imageUrl;

    try {
      // Step A: Download image
      console.log(`  ⬇️ Downloading from ${item.imageUrl}...`);
      const response = await fetch(item.imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      const arrayBuf = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

      // Step B: Save locally
      const localFilePath = path.join(localDir, item.fileName);
      fs.writeFileSync(localFilePath, buffer);
      console.log(`  💾 Saved locally: public/images/portfolio/${item.fileName}`);

      // Step C: Upload to Cloudinary
      console.log(`  ☁️ Uploading to Cloudinary (mighty-warner/portfolio/${item.publicId})...`);
      const secureUrl = await uploadToCloudinary(buffer, item.publicId);
      finalImageUrl = secureUrl;
      console.log(`  ✅ Cloudinary URL: ${secureUrl}`);
    } catch (uploadErr: any) {
      console.warn(`  ⚠️ Upload warning for ${item.title}:`, uploadErr.message);
      console.log(`  Using fallback URL: ${item.imageUrl}`);
    }

    // Step D: Insert into PostgreSQL database (Project table)
    const existing = await prisma.project.findFirst({
      where: { title: item.title },
    });

    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: {
          category: item.category,
          thumbnailImage: finalImageUrl,
          liveUrl: item.liveUrl,
          published: true,
          featured: false, // Per user instruction: all in catalog, curated manually
          order: i + 1,
        },
      });
      console.log(`  🔄 Updated project in database`);
    } else {
      await prisma.project.create({
        data: {
          title: item.title,
          category: item.category,
          thumbnailImage: finalImageUrl,
          liveUrl: item.liveUrl,
          published: true,
          featured: false, // Per user instruction: all in catalog, curated manually
          order: i + 1,
        },
      });
      console.log(`  ✨ Created project in database`);
    }
    count++;
  }

  console.log(`\n🎉 Successfully processed and inserted ${count} projects into the database!`);
}

main()
  .catch((e) => {
    console.error('Fatal error during portfolio import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
