#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('\n🎮 HELP GAME — Configuração Inicial\n');
// Verificar se .env existe
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');
if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('📋 Criando arquivo .env...');
  const envContent = fs.readFileSync(envExamplePath, 'utf-8');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env criado. Por favor, edite com suas credenciais.');
  console.log('   Arquivo: backend/.env\n');
} else if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env já existe.\n');
}
// Criar diretório data se não existir
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Diretório data/ criado.\n');
}
console.log('📝 PRÓXIMAS PASSOS:\n');
console.log('1. Edite backend/.env com suas credenciais SMTP');
console.log('   - SMTP_USER: seu email Gmail');
console.log('   - SMTP_PASS: sua senha de app do Gmail\n');
console.log('2. Inicie o servidor backend:');
console.log('   npm run dev\n');
console.log('3. Em outro terminal, inicie o frontend:');
console.log('   Live Server em VS Code OU python -m http.server 5500\n');
console.log('4. Acesse: http://localhost:5500/register.html\n');
console.log('📚 Documentação: Veja ../README_REGISTRO.md\n');

