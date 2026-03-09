import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = 'https://uwddeseqwdsryvuoulsm.supabase.co'
const serviceKey = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, serviceKey)

const videos = [
  {
    localPath: 'public/왕십리 정원오 성동구청장.mp4',
    storagePath: 'videos/wangsimni-jeongwono-seongdong.mp4',
    label: 'Video 1'
  },
  {
    localPath: 'public/정원오 서울시장.mp4',
    storagePath: 'videos/jeongwono-seoul.mp4',
    label: 'Video 2'
  }
]

for (const video of videos) {
  const fullPath = path.resolve(video.localPath)
  const fileBuffer = fs.readFileSync(fullPath)
  const sizeMB = (fileBuffer.length / 1024 / 1024).toFixed(1)

  console.log(`\n${video.label}: Uploading ${sizeMB}MB → ${video.storagePath}`)

  const { data, error } = await supabase.storage
    .from('landing')
    .upload(video.storagePath, fileBuffer, {
      contentType: 'video/mp4',
      upsert: true
    })

  if (error) {
    console.error(`${video.label} FAILED:`, error.message)
  } else {
    const { data: urlData } = supabase.storage
      .from('landing')
      .getPublicUrl(video.storagePath)
    console.log(`${video.label} OK: ${urlData.publicUrl}`)
  }
}
