import COLORS_ALL from './colorsAll.json'
import COLORS_WARHOL from './colorsWarhol.json'
import COLORS_HARRY_POTTER from './colorsHarryPotter.json'
import COLORS_IRON_MAN from './colorsIronMan.json'
import COLORS_STAR_WARS from './colorsStarWars.json'
import COLORS_THE_BEATELS from './colorsTheBeatels.json'
import COLORS_MICKEY_MOUSE from './colorsMickeyMouse.json'
import COLORS_LEGO_WORLD_MAP from './worldMap.json'
import COLORS_PORTRAIT from './colorsPortraits.json'
import COLORS_BATMAN from './colorsBatman.json'
import COLORS_BATMAN_HARLEY_QUIN from './colorsBatmanHarleyQuin.json'
import COLORS_BATMAN_JOKER from './colorsBatmanJoker.json'
import COLORS_ELVIS from './colorsElvis.json'
import COLORS_ART_PROJECT from './colorsArtProject.json'

const loadedColors = [
  {
    id: 1,
    name: 'All',
    colors: COLORS_ALL,
    nr: '',
    image: '/webp/80x80-lego.webp',
    pcs: 100000,
  },
  {
    id: 2,
    name: 'Andy Warhol',
    colors: COLORS_WARHOL,
    nr: '/webp/80x80-warhol.webp',
    image: '',
    pcs: 0,
  },
  {
    id: 3,
    name: 'The Beatels',
    colors: COLORS_THE_BEATELS,
    nr: '',
    image: '/webp/80x80-the-beatels.webp',
    pcs: 0,
  },
  {
    id: 4,
    name: 'Iron Man',
    colors: COLORS_IRON_MAN,
    nr: '',
    image: '/webp/80x80-iron-man.webp',
    pcs: 0,
  },
  {
    id: 5,
    name: 'Harry Potter',
    colors: COLORS_HARRY_POTTER,
    nr: '',
    image: '/webp/80x80-harry-potter.webp',
    pcs: 0,
  },
  {
    id: 6,
    name: 'Star Wars',
    colors: COLORS_STAR_WARS,
    nr: '',
    image: '/webp/80x80-star-wars.webp',
    pcs: 0,
  },
  {
    id: 7,
    name: 'Mickey Mouse',
    colors: COLORS_MICKEY_MOUSE,
    nr: '',
    image: '/webp/80x80-mickey-mouse.webp',
    pcs: 2658,
  },
  {
    id: 8,
    name: 'World Map',
    colors: COLORS_LEGO_WORLD_MAP,
    nr: '31203',
    image: '/webp/80x80-world-map.webp',
    pcs: 11695,
  },
  {
    id: 9,
    name: 'Portrait',
    colors: COLORS_PORTRAIT,
    nr: '/webp/80x80-portrait.webp',
    image: '40179',
    pcs: 4502,
  },
  {
    id: 10,
    name: 'Batman - All',
    colors: COLORS_BATMAN,
    nr: '31205',
    image: '/webp/80x80-batman.webp',
    pcs: 4167,
  },
  {
    id: 11,
    name: 'Batman - Harley Quin',
    colors: COLORS_BATMAN_HARLEY_QUIN,
    nr: '31205',
    image: '/webp/80x80-batman.webp',
    pcs: 4167,
  },
  {
    id: 12,
    name: 'Batman - Joker',
    colors: COLORS_BATMAN_JOKER,
    nr: '31205',
    image: '/webp/80x80-batman.webp',
    pcs: 4167,
  },
  {
    id: 13,
    name: 'Elvis Presley',
    colors: COLORS_ELVIS,
    nr: '31204',
    image: '/webp/80x80-elvis.webp',
    pcs: 0,
  },
  {
    id: 14,
    name: 'Art Project',
    colors: COLORS_ART_PROJECT,
    nr: '21226',
    image: '/webp/80x80-art-project.webp',
    pcs: 0,
  },
  // {
  //   id: 15,
  //   name: 'Modern Art',
  //   colors: COLORS_MODERN_ART,
  //   nr: '31210',
  //   image: '',
  //   pcs: 805,
  // },
  {
    id: 16,
    name: 'Joker',
    colors: COLORS_JOKER,
    nr: '',
    image: '/webp/80x80-joker.webp',
    pcs: 31205,
  },
]

export default loadedColors
