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

cmake -DCMAKE_TOOLCHAIN_FILE=$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DWASM_FEATURE=basic ..
make -j8

cmake -DCMAKE_TOOLCHAIN_FILE=$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DWASM_FEATURE=simd ..
make -j8

cmake -DCMAKE_TOOLCHAIN_FILE=$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DWASM_FEATURE=threads ..
make -j8

cmake -DCMAKE_TOOLCHAIN_FILE=$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DWASM_FEATURE=simd-threads ..
make -j8

# TODO: 统一脚本
```
