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
    description: 'Studs produced in all colors',
    colors: COLORS_ALL,
    nr: '',
    image: '/webp/sets/80x80-lego.webp',
    pcs: 100000,
  },
  {
    id: 2,
    name: 'Andy Warhol',
    description: 'Mona Lisa variations',
    colors: COLORS_WARHOL,
    nr: '31197',
    image: '/webp/sets/80x80-warhol.webp',
    pcs: 3341,
  },
  {
    id: 3,
    name: 'The Beatels',
    description: 'Lennon and others on 4x4 portrait',
    colors: COLORS_THE_BEATELS,
    nr: '31198',
    image: '/webp/sets/80x80-the-beatels.webp',
    pcs: 2933,
  },
  {
    id: 4,
    name: 'Iron Man',
    description: 'War Machine Mark II and Iron Man portraits',
    colors: COLORS_IRON_MAN,
    nr: '31199',
    image: '/webp/sets/80x80-iron-man.webp',
    pcs: 3167,
  },
  {
    id: 5,
    name: 'Harry Potter',
    description: 'Badges of all houses',
    colors: COLORS_HARRY_POTTER,
    nr: '31201',
    image: '/webp/sets/80x80-harry-potter.webp',
    pcs: 4249,
  },
  {
    id: 6,
    name: 'Star Wars',
    description: 'Darth Maul, Dark Vader and Dark Trooper',
    colors: COLORS_STAR_WARS,
    nr: '31200',
    image: '/webp/sets/80x80-star-wars.webp',
    pcs: 3406,
  },
  {
    id: 7,
    name: 'Mickey Mouse',
    description: 'Mickey and Minnie mouse',
    colors: COLORS_MICKEY_MOUSE,
    nr: '31202',
    image: '/webp/sets/80x80-mickey-mouse.webp',
    pcs: 2658,
  },
  {
    id: 8,
    name: 'World Map',
    description: 'Map of all continents',
    colors: COLORS_LEGO_WORLD_MAP,
    nr: '31203',
    image: '/webp/sets/80x80-world-map.webp',
    pcs: 11695,
  },
  {
    id: 9,
    name: 'Portrait',
    description: 'Mosaic of your own face in 4 colours',
    colors: COLORS_PORTRAIT,
    nr: '40179',
    image: '/webp/sets/80x80-portrait.webp',
    pcs: 4502,
  },
  {
    id: 10,
    name: 'Batman - Batman',
    description: 'Colors used to create Batman',
    colors: COLORS_BATMAN,
    nr: '31205',
    image: '/webp/sets/80x80-batman.webp',
    pcs: 4167,
  },
  {
    id: 11,
    name: 'Batman - Harley Quin',
    description: 'Colors used to create Harley',
    colors: COLORS_BATMAN_HARLEY_QUIN,
    nr: '31205',
    image: '/webp/sets/80x80-batman.webp',
    pcs: 4167,
  },
  {
    id: 12,
    name: 'Batman - Joker',
    description: 'Colors used to create Joker',
    colors: COLORS_BATMAN_JOKER,
    nr: '31205',
    image: '/webp/sets/80x80-batman.webp',
    pcs: 4167,
  },
  {
    id: 13,
    name: 'Elvis Presley',
    description: 'Elvis face from 3 different angles',
    colors: COLORS_ELVIS,
    nr: '31204',
    image: '/webp/sets/80x80-elvis.webp',
    pcs: 3445,
  },
  {
    id: 14,
    name: 'Art Project',
    description: "36 small pictures and astronaut's portrait",
    colors: COLORS_ART_PROJECT,
    nr: '21226',
    image: '/webp/sets/80x80-art-project.webp',
    pcs: 4138,
  },
  // {
  //   id: 15,
  //   name: 'Modern Art',
  //   colors: COLORS_MODERN_ART,
  //   nr: '31210',
  //   image: '',
  //   pcs: 805,
  // },
  // {
  //   id: 16,
  //   name: 'Joker',
  //   description: '',
  //   colors: COLORS_JOKER,
  //   nr: '',
  //   image: '/webp/sets/80x80-joker.webp',
  //   pcs: 31205,
  // },
]

export default loadedColors
