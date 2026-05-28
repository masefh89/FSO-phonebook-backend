import globals from "globals"
import js from "@eslint/js"
import stylisticJs from "@stylistic/eslint-plugin"

export default [
  js.configs.recommended,
  {
    "files" : ["**/*.js"],
    languageOptions :{
      sourceType : "commonjs",
      globals : {... globals.node},
      ecmaVersion : "latest"
    },
  plugins : {
   "@stylistic/js": stylisticJs,
  },
  rules : {
    "@stylistic/js/indent" : ["error", 2],
    "@stylistic/js/semi" : ["error", "never"],
    "@stylistic/js/linebreak-style" : ["error" , "unix"],
    eqeqeq : "error",
    "no-console" : "off",
    "no-trailing-spaces" : "error",
    "object-curly-spacing" : ["error", "always"],
    "arrow-spacing" : ["error", {before: true, after: true}]

  },
  
  },
  {
    ignores: ["dist/**"]
  }
  
]