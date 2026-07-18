require('dotenv').config()

import { prisma } from './src/lib/prisma'

async function main() {
  const settings = await prisma.siteSetting.findMany()
  console.log("Settings found: ", settings.length)
  for (const s of settings) {
    if (s.key === 'about_years' && (s.value === '20+' || s.value === '"20+"')) {
      await prisma.siteSetting.update({
        where: { key: 'about_years' },
        data: { value: '9+' }
      })
      console.log('Updated about_years');
    }
    if (s.key === 'about_paragraph1' && s.value.includes('hơn 20 năm')) {
      await prisma.siteSetting.update({
        where: { key: 'about_paragraph1' },
        data: { value: s.value.replace('hơn 20 năm', 'gần 10 năm') }
      })
      console.log('Updated about_paragraph1');
    }
  }
}

main()
  .then(() => console.log('Done'))
  .catch(console.error)
  .finally(async () => {
    process.exit(0)
  })
