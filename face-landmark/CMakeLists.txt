cmake_minimum_required (VERSION 2.6)

project (retinaface_ncnn)

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -qopenmp")
add_executable(retinaface_ncnn anchor_generator.cpp config.cpp tools.cpp src/detect1.cpp)
find_package( OpenCV REQUIRED )
target_link_libraries( retinaface_ncnn ${OpenCV_LIBS} )

set_target_properties(retinaface_ncnn PROPERTIES CXX_STANDARD 11)
find_package(OpenMP)
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${OpenMP_C_FLAGS}")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenMP_CXX_FLAGS}")

include_directories(./includes)
set(ncnn_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../ncnn-webassembly/${WASM_FEATURE}/lib/cmake/ncnn")
find_package(ncnn REQUIRED)
target_link_libraries(retinaface_ncnn ncnn)
