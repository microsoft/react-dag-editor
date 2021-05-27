import { ICanvasData } from "../../../src";

export const sampleData: ICanvasData = {
    nodes: [{
        id: "2c029545",
        x: 628.5,
        y: 101,
        name: "Edit Metadata",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "completed"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Results_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "8b2714dd",
        x: 630.5,
        y: 229.5,
        name: "Split Data",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "completed"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Results_dataset1",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.3333333333333333, 1]
        }, {
            id: "port-2",
            name: "Results_dataset2",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "16e05bd4",
        x: 293,
        y: 723.25,
        name: "Train Model",
        data: {
            comment: "",
            iconName: "ModelingView",
            status: "completed"
        },
        ports: [{
            id: "port-0",
            name: "Untrained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Trained_model",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "9d4beb0a",
        x: 377,
        y: 822.25,
        name: "Score Model",
        data: {
            comment: "",
            iconName: "WebAppBuilderModule",
            status: "completed"
        },
        ports: [{
            id: "port-0",
            name: "Trained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Scored_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "7aae9f55",
        x: 463,
        y: 913.25,
        name: "Evaluate Model",
        data: {
            comment: "",
            iconName: "WebAppBuilderModule",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Scored_dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Scored_dataset_to_compare",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Evaluation_results",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "19d671b7",
        x: 708,
        y: 816.25,
        name: "Score Model",
        data: {
            comment: "",
            iconName: "WebAppBuilderModule",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Trained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Scored_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "20268eed",
        x: 643.5,
        y: 723.75,
        name: "Train Model",
        data: {
            comment: "",
            iconName: "ModelingView",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Untrained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Trained_model",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "9aa757f3",
        x: 1212,
        y: 550.25,
        name: "Normalize Data",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Transformed_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.3333333333333333, 1]
        }, {
            id: "port-2",
            name: "Transformation_function",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "b925ba85",
        x: 899,
        y: 549.75,
        name: "Normalize Data",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Transformed_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.3333333333333333, 1]
        }, {
            id: "port-2",
            name: "Transformation_function",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "47fadd6c",
        x: 1085,
        y: 636.75,
        name: "Two-Class Boosted Decision Tree",
        data: {
            comment: "",
            iconName: "MachineLearning",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Untrained_model",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "2a1e48b4",
        x: 1426,
        y: 751.75,
        name: "Train Model",
        data: {
            comment: "",
            iconName: "ModelingView",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Untrained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Trained_model",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "c2d2ecc7",
        x: 1039.5,
        y: 751.25,
        name: "Train Model",
        data: {
            comment: "",
            iconName: "ModelingView",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Untrained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Trained_model",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "95fa7c3c",
        x: 136,
        y: 560.75,
        name: "Normalize Data",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Transformed_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.3333333333333333, 1]
        }, {
            id: "port-2",
            name: "Transformation_function",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "cc9bc74b",
        x: 975,
        y: 858.75,
        name: "Score Model",
        data: {
            comment: "",
            iconName: "WebAppBuilderModule",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Trained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Scored_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "ebac8c00",
        x: 1378,
        y: 859.25,
        name: "Score Model",
        data: {
            comment: "",
            iconName: "WebAppBuilderModule",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Trained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Scored_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "38b07723",
        x: 1150,
        y: 956.25,
        name: "Evaluate Model",
        data: {
            comment: "",
            iconName: "WebAppBuilderModule",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Scored_dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Scored_dataset_to_compare",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Evaluation_results",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "7245d452",
        x: 632,
        y: 1041.25,
        name: "Add Rows",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Dataset1",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset2",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Results_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "6dd0e2c2",
        x: 636,
        y: 1148.25,
        name: "Execute Python Script",
        data: {
            comment: "",
            iconName: "PythonLanguage",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Dataset1",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.25, 0]
        }, {
            id: "port-1",
            name: "Dataset2",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-2",
            name: "Script_Bundle",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.75, 0]
        }, {
            id: "port-3",
            name: "Result_Dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.3333333333333333, 1]
        }, {
            id: "port-4",
            name: "Python_Device",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "5f5d20e0",
        x: 632,
        y: 1265.25,
        name: "Select Columns in Dataset",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Results_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "24a8e253",
        x: 489.5,
        y: 407.5,
        name: "Normalize Data",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Transformed_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.3333333333333333, 1]
        }, {
            id: "port-2",
            name: "Transformation_function",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "960949ea",
        x: 1039,
        y: 399.5,
        name: "Execute Python Script",
        data: {
            comment: "",
            iconName: "PythonLanguage",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Dataset1",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.25, 0]
        }, {
            id: "port-1",
            name: "Dataset2",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-2",
            name: "Script_Bundle",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.75, 0]
        }, {
            id: "port-3",
            name: "Result_Dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.3333333333333333, 1]
        }, {
            id: "port-4",
            name: "Python_Device",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "fc9f8703",
        x: 73,
        y: 408,
        name: "Execute Python Script",
        data: {
            comment: "",
            iconName: "PythonLanguage",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Dataset1",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.25, 0]
        }, {
            id: "port-1",
            name: "Dataset2",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.5, 0]
        }, {
            id: "port-2",
            name: "Script_Bundle",
            isInputDisabled: false,
            isOutputDisabled: true,
            position: [0.75, 0]
        }, {
            id: "port-3",
            name: "Result_Dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.3333333333333333, 1]
        }, {
            id: "port-4",
            name: "Python_Device",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "bfb1b0ae",
        x: 488,
        y: 549.75,
        name: "Two-Class Support Vector Machine",
        data: {
            comment: "",
            iconName: "MachineLearning",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "Untrained_model",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }, {
        id: "8c0f896d",
        x: 615,
        y: -26,
        name: "German Credit Card UCI dataset",
        data: {
            comment: "",
            iconName: "Database",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "DatasetOutput",
            isInputDisabled: true,
            isOutputDisabled: false,
            position: [0.5, 1]
        }]
    }],
    edges: [{
        source: "2c029545",
        target: "8b2714dd",
        sourcePortId: "port-1",
        targetPortId: "port-0",
        id: "0"
    }, {
        source: "8b2714dd",
        target: "fc9f8703",
        sourcePortId: "port-1",
        targetPortId: "port-0",
        id: "1"
    }, {
        source: "fc9f8703",
        target: "95fa7c3c",
        sourcePortId: "port-3",
        targetPortId: "port-0",
        id: "2"
    }, {
        source: "95fa7c3c",
        target: "16e05bd4",
        sourcePortId: "port-1",
        targetPortId: "port-1",
        id: "3"
    }, {
        source: "bfb1b0ae",
        target: "16e05bd4",
        sourcePortId: "port-0",
        targetPortId: "port-0",
        id: "4"
    }, {
        source: "16e05bd4",
        target: "9d4beb0a",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "5"
    }, {
        source: "9d4beb0a",
        target: "7aae9f55",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "6"
    }, {
        source: "8b2714dd",
        target: "960949ea",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "7"
    }, {
        source: "960949ea",
        target: "b925ba85",
        sourcePortId: "port-3",
        targetPortId: "port-0",
        id: "8"
    }, {
        source: "b925ba85",
        target: "9d4beb0a",
        sourcePortId: "port-1",
        targetPortId: "port-1",
        id: "9"
    }, {
        source: "8b2714dd",
        target: "24a8e253",
        sourcePortId: "port-1",
        targetPortId: "port-0",
        id: "10"
    }, {
        source: "bfb1b0ae",
        target: "20268eed",
        sourcePortId: "port-0",
        targetPortId: "port-0",
        id: "11"
    }, {
        source: "24a8e253",
        target: "20268eed",
        sourcePortId: "port-1",
        targetPortId: "port-1",
        id: "12"
    }, {
        source: "20268eed",
        target: "19d671b7",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "13"
    }, {
        source: "19d671b7",
        target: "7aae9f55",
        sourcePortId: "port-2",
        targetPortId: "port-1",
        id: "14"
    }, {
        source: "8b2714dd",
        target: "9aa757f3",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "15"
    }, {
        source: "47fadd6c",
        target: "c2d2ecc7",
        sourcePortId: "port-0",
        targetPortId: "port-0",
        id: "16"
    }, {
        source: "47fadd6c",
        target: "2a1e48b4",
        sourcePortId: "port-0",
        targetPortId: "port-0",
        id: "17"
    }, {
        source: "b925ba85",
        target: "19d671b7",
        sourcePortId: "port-1",
        targetPortId: "port-1",
        id: "18"
    }, {
        source: "fc9f8703",
        target: "c2d2ecc7",
        sourcePortId: "port-3",
        targetPortId: "port-1",
        id: "19"
    }, {
        source: "c2d2ecc7",
        target: "cc9bc74b",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "20"
    }, {
        source: "960949ea",
        target: "cc9bc74b",
        sourcePortId: "port-3",
        targetPortId: "port-1",
        id: "21"
    }, {
        source: "2a1e48b4",
        target: "ebac8c00",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "22"
    }, {
        source: "960949ea",
        target: "ebac8c00",
        sourcePortId: "port-3",
        targetPortId: "port-1",
        id: "23"
    }, {
        source: "8b2714dd",
        target: "2a1e48b4",
        sourcePortId: "port-1",
        targetPortId: "port-1",
        id: "24"
    }, {
        source: "cc9bc74b",
        target: "38b07723",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "25"
    }, {
        source: "ebac8c00",
        target: "38b07723",
        sourcePortId: "port-2",
        targetPortId: "port-1",
        id: "26"
    }, {
        source: "7aae9f55",
        target: "7245d452",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "27"
    }, {
        source: "38b07723",
        target: "7245d452",
        sourcePortId: "port-2",
        targetPortId: "port-1",
        id: "28"
    }, {
        source: "7245d452",
        target: "6dd0e2c2",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "29"
    }, {
        source: "6dd0e2c2",
        target: "5f5d20e0",
        sourcePortId: "port-3",
        targetPortId: "port-0",
        id: "30"
    }, {
        source: "8c0f896d",
        target: "2c029545",
        sourcePortId: "port-0",
        targetPortId: "port-0",
        id: "31"
    }]
};