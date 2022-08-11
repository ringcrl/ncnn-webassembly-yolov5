set -e

mkdir -p build
cd build

# ~/Documents/saga/emsdk/emsdk activate 2.0.21
# source ~/Documents/saga/emsdk/emsdk_env.sh

build_and_move_lib() {
  cmake -DCMAKE_TOOLCHAIN_FILE=$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DWASM_FEATURE=$wasm_feature ..
  make -j8
  mv yolov5-$wasm_feature.js yolov5-$wasm_feature.data yolov5-$wasm_feature.wasm ../public/
}

# wasm_feature=basic
# build_and_move_lib

wasm_feature=simd
build_and_move_lib

# wasm_feature=threads
# build_and_move_lib

# wasm_feature=simd-threads
# build_and_move_lib
