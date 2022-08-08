# ncnn-webassembly-yolov5

```sh
# emscripten
# 只能是这个版本，低了 404，高了 error: undefined symbol
# https://github.com/emscripten-core/emscripten/issues/16826
~/Documents/saga/emsdk/emsdk install 2.0.21
~/Documents/saga/emsdk/emsdk activate 2.0.21
source ~/Documents/saga/emsdk/emsdk_env.sh

# 更新 ncnn-webassembly：https://github.com/Tencent/ncnn/releases

# 编译四个版本的 webassembly
mkdir build
cd build

wasm_feature=basic
wasm_feature=simd
wasm_feature=threads
wasm_feature=simd-threads

cmake -DCMAKE_TOOLCHAIN_FILE=$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DWASM_FEATURE=$wasm_feature ..
make -j8
mv yolov5-$wasm_feature.js yolov5-$wasm_feature.data yolov5-$wasm_feature.wasm ../public/

```
