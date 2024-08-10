/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    fontFamily :{
      "bidad_B" :  "bidad_B",
      "bidad_L" :  "bidad_L",
      "bidad_M" :  "bidad_M",
      "bidad_T" :  "bidad_T",
      "gohar_B" :  "gohar_B",
      "gohar_L" :  "gohar_L",
      "gohar_M" :  "gohar_M",
      "gohar_T" :  "gohar_T",
      "holda" :  "holda",
      "iransans_B" :  "iransans_B",
      "iransans_M" :  "iransans_M",
      "iransans_L" :  "iransans_L",
      "kalme_B" :  "kalme_B",
      "kalme_L" :  "kalme_L",
      "kalme_M" :  "kalme_M",
      "kalme_T" :  "kalme_T",
      "pinar_B" :  "pinar_B",
      "pinar_L" :  "pinar_L",
      "pinar_M" :  "pinar_M",
      "pinar_T" :  "pinar_T"
    },
    extend: {
      screens:{
        "lap" : "426px"
      },
      colors: {
        primary: {"50":"#fffbeb","100":"#fef3c7","200":"#fde68a","300":"#fcd34d","400":"#fbbf24","500":"#f59e0b","600":"#d97706","700":"#b45309","800":"#92400e","900":"#78350f","950":"#451a03"}
      }
    },
    container: {
      "center": true , 
      "padding" : "2rem"
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

