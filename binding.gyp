{
    "targets": [
        {
            "target_name": "specialkeyEmulator",
            "sources": [
                "src/darwin/specialkey-emulator.mm"
            ],
            "include_dirs": [
            "src",
            "<!(node -e \"require('nan')\")" ],
            "conditions": [
                [
                    "OS=='mac'",
                    {
                        "configurations": {
                            "Release": {
                                "defines": [
                                    "NDEBUG"
                                ],
                                "xcode_settings": {
                                    "GCC_OPTIMIZATION_LEVEL": 3
                                }
                            },
                            "Debug": {
                                "defines": [
                                    "NDEBUG"
                                ],
                                "xcode_settings": {
                                    "GCC_OPTIMIZATION_LEVEL": 0
                                }
                            }
                        },
                        "default_configuration": "Debug",
                        "link_settings": {
                            "libraries": [
                                "$(SDKROOT)/System/Library/Frameworks/IOKit.framework"
                            ]
                        },
                        "xcode_settings": {
                            "ARCHS": [
                                "$(ARCHS_STANDARD_64_BIT)"
                            ],
                            "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES": "YES",
                            "CLANG_ENABLE_MODULES": "YES",
                            "CLANG_LINK_OBJC_RUNTIME": "YES",
                            "CLANG_MODULES_AUTOLINK": "YES",
                            "CLANG_CXX_LANGUAGE_STANDARD": "gnu++11",
                            "CLANG_CXX_LIBRARY": "libc++",
                            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                            "GCC_ENABLE_CPP_RTTI": "YES",
                            "LINK_WITH_STANDARD_LIBRARIES": "YES",
                            "MACOSX_DEPLOYMENT_TARGET": "10.13",
                            "OTHER_CPLUSPLUSFLAGS": [
                                "-mmacosx-version-min=10.13"
                            ],
                            "OTHER_LDFLAGS": [
                                 "-undefined dynamic_lookup",
                                 "-framework IOKit"
                            ],
                            "SDKROOT": "macosx"
                        }
                    }
                ]
            ]
        }
    ]
}
