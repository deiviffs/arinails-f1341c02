# Desplegar Arinails en Vercel

El proyecto es TanStack Start (SSR), no una app estática. Por eso en Vercel salía "página no encontrada": Vercel intentaba servir una carpeta `dist` que no existe.

## Pasos

1. Importa el repositorio en Vercel.
2. En **Framework Preset** elige **Other** (el archivo `vercel.json` ya fija todo:
   build `npm run build` y salida `.vercel/output`).
3. Agrega estas variables de entorno en **Settings → Environment Variables**:

   | Variable | Uso |
   | --- | --- |
   | `VITE_SUPABASE_URL` | cliente |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | cliente |
   | `VITE_SUPABASE_PROJECT_ID` | cliente |
   | `SUPABASE_URL` | servidor |
   | `SUPABASE_PUBLISHABLE_KEY` | servidor |
   | `SUPABASE_SERVICE_ROLE_KEY` | servidor (guardar/borrar enlaces) |
   | `BIO_ADMIN_PASSWORD` | contraseña del panel de administradora |

   Los valores de las cuatro primeras están en el archivo `.env` del proyecto.

4. Deploy. No hace falta `dist`, ni `_redirects`, ni configuración extra de rutas.
