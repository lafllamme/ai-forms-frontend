import {defineConfig, transformerDirectives, transformerVariantGroup} from 'unocss'
import {extendTheme, presets, shortcuts, theme} from './assets/unocss'

export default defineConfig({
    shortcuts,
    theme,
    extendTheme,
    //@ts-ignore The type is valid, but the linter doesn't recognize it
    presets,
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
})
