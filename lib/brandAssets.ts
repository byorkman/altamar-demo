/** Imágenes editoriales de Unsplash (licencia Unsplash). */
const u = (photo: string, w = 2000, h?: number) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

export const brandAssets = {
  heroMain: u("photo-1783595468354-7f5543c947b9"),
  heroBeach: u("photo-1771150360065-c5be614fbee8"),
  heroKnown: u("photo-1683488780105-ee56942734b3"),

  tileMujer: u("photo-1790516099864-b713b25b072d", 900, 1200),
  tileHombre: u("photo-1620989465579-b859e52f41f5", 900, 1200),
  tileNinos: u("photo-1502451885777-16c98b07834a", 900, 1200),
  tileAccesorios: u("photo-1641934777532-d277296b111c", 900, 1200),

  linen: u("photo-1746527972280-407363a3191b"),
  kids: u("photo-1695425812104-8a9963d58887"),
  coast: u("photo-1740815658045-8e10409bbce7"),
  village: u("photo-1781337049639-9492908df2fc"),
  espadrilles: u("photo-1565953198075-db265882ee68", 1200, 900)
};
