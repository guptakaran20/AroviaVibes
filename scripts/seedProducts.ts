// Note: You can run this script using `npx ts-node scripts/seedProducts.ts` 
// Make sure to have your Supabase env vars set.

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Use service role if available for bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const seedProducts = async () => {
  try {
    const dataPath = path.join(process.cwd(), 'lib', 'data.json')
    const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    console.log(`Found ${products.length} products to seed...`)

    for (const product of products) {
      const { data, error } = await supabase
        .from('products')
        .upsert({
          name: product.name,
          slug: product.name.toLowerCase().replace(/ /g, '-'),
          description: product.description,
          brand: product.brand,
          price: product.price,
          discount_price: product.oldPrice,
          category: product.category,
          image_url: product.image,
          secondary_image_url: product.secondaryImage,
          stock: product.stock || 10,
          rating: product.rating || 5,
          is_new: product.isNew !== undefined ? product.isNew : true,
          is_featured: false
        }, { onConflict: 'slug' })

      if (error) {
        console.error(`Error seeding ${product.name}:`, error.message)
      } else {
        console.log(`Seeded: ${product.name}`)
      }
    }

    console.log('Seeding completed successfully!')
  } catch (err) {
    console.error('Seeding failed:', err)
  }
}

seedProducts()
