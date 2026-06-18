const fs = require('fs'); 
const files = [
  'src/app/api/register/route.ts', 
  'src/app/api/v1/auth/profile/route.ts', 
  'src/app/api/v1/auth/reset-pin/route.ts', 
  'src/app/api/v1/auth/send-otp/route.ts', 
  'src/app/api/v1/auth/setup-pin/route.ts', 
  'src/app/api/v1/auth/verify-otp/route.ts', 
  'src/app/api/v1/auth/verify-pin/route.ts', 
  'src/app/api/v1/client/invest/route.ts', 
  'src/app/api/v1/client/kyc/route.ts', 
  'src/app/api/v1/client/withdraw/route.ts', 
  'src/app/api/v1/upload/route.ts'
]; 
files.forEach(f => { 
  let content = fs.readFileSync(f, 'utf8'); 
  if (!content.includes('export const dynamic')) { 
    fs.writeFileSync(f, `export const dynamic = 'force-dynamic';\n\n` + content); 
    console.log('Fixed ' + f); 
  } 
});
