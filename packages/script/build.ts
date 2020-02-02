import { rollup } from "rollup";

import ora from "ora";

process.env.NODE_ENV = "production";

const spinner = ora("building for production...");
spinner.start();

async function build(): Promise<void> {
    const rollupConfig = (await import("./config")).default;
    //处理不必要的警告
    rollupConfig.onwarn = (warning): void => {
        // 跳过某些警告
        if (warning.code === "INPUT_HOOK_IN_OUTPUT_PLUGIN") return;

        // 抛出异常
        // if (warning.code === "NON_EXISTENT_EXPORT")
        //     throw new Error(warning.message);
        console.warn(warning);
    };
    const bundle = await rollup(rollupConfig);
    // generate code
    const { output } = await bundle.generate(rollupConfig);

    for (const chunkOrAsset of output) {
        if (chunkOrAsset.type === "asset") {
            // For assets, this contains
            // {
            //   fileName: string,              // the asset file name
            //   source: string | Buffer        // the asset source
            //   type: 'asset'                  // signifies that this is an asset
            // }
            // console.log("Asset", chunkOrAsset);
        } else {
            // For chunks, this contains
            // {
            //   code: string,                  // the generated JS code
            //   dynamicImports: string[],      // external modules imported dynamically by the chunk
            //   exports: string[],             // exported variable names
            //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
            //   fileName: string,              // the chunk file name
            //   imports: string[],             // external modules imported statically by the chunk
            //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
            //   isEntry: boolean,              // is this chunk a static entry point
            //   map: string | null,            // sourcemaps if present
            //   modules: {                     // information about the modules in this chunk
            //     [id: string]: {
            //       renderedExports: string[]; // exported variable names that were included
            //       removedExports: string[];  // exported variable names that were removed
            //       renderedLength: number;    // the length of the remaining code in this module
            //       originalLength: number;    // the original length of the code in this module
            //     };
            //   },
            //   name: string                   // the name of this chunk as used in naming patterns
            //   type: 'chunk',                 // signifies that this is a chunk
            // }
            // console.log("Chunk", chunkOrAsset.modules);
        }
    }

    // or write the bundle to disk

    if (Array.isArray(rollupConfig.output)) {
        rollupConfig.output.forEach(async item => {
            await bundle.write(item);
        });
    }
}
build().then(() => {
    spinner.stop();
});
