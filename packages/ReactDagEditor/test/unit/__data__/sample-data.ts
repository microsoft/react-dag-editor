import { ICanvasData } from "../../../src";

export const sampleData: ICanvasData = {
    nodes: [{
        id: "47566002",
        x: 548,
        y: 162,
        name: "Select Columns in Dataset",
        ariaLabel: "test aria label for node Select Columns in Dataset",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "completed",
            startTime: "2020-04-23T04:44:02.9800128Z",
            endTime: "2020-04-23T04:44:25.2663764Z"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            ariaLabel: "test aria label for port Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            shape: "modulePort",
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Results_dataset",
            ariaLabel: "test aria label for port Results_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.5, 1]
        }]
    }, {
        id: "f6dc0eb1",
        x: 548,
        y: 280,
        name: "Clean Missing Data",
        ariaLabel: "test aria label for node Clean Missing Data",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "completed",
            startTime: "2020-04-23T04:45:18.0911213Z",
            endTime: "2020-04-23T04:45:48.3802172Z"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            ariaLabel: "test aria label for port Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            shape: "modulePort",
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Cleaned_dataset",
            ariaLabel: "test aria label for port Cleaned_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.3333333333333333, 1]
        }, {
            id: "port-2",
            name: "Cleaning_transformation",
            ariaLabel: "test aria label for port Cleaning_transformation",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "d1647408",
        x: 542,
        y: 386,
        name: "Split Data",
        ariaLabel: "test aria label for node Split Data",
        data: {
            comment: "",
            iconName: "TestUserSolid",
            status: "completed",
            startTime: "2020-04-23T04:46:31.3318491Z",
            endTime: "2020-04-23T04:47:06.4339613Z"
        },
        ports: [{
            id: "port-0",
            name: "Dataset",
            ariaLabel: "test aria label for port Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            shape: "modulePort",
            position: [0.5, 0]
        }, {
            id: "port-1",
            name: "Results_dataset1",
            ariaLabel: "test aria label for port Results_dataset1",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.3333333333333333, 1]
        }, {
            id: "port-2",
            name: "Results_dataset2",
            ariaLabel: "test aria label for port Results_dataset2",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.6666666666666666, 1]
        }]
    }, {
        id: "4b199015",
        x: 173,
        y: 393.5,
        name: "Linear Regression",
        ariaLabel: "test aria label for node Linear Regression",
        data: {
            comment: "",
            iconName: "MachineLearning",
            status: "completed",
            startTime: "2020-04-23T04:42:19.1273574Z",
            endTime: "2020-04-23T04:42:19.2145871Z"
        },
        ports: [{
            id: "port-0",
            name: "Untrained_model",
            ariaLabel: "test aria label for port Untrained_model",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.5, 1]
        }]
    }, {
        id: "fb404f70",
        x: 387,
        y: 517,
        name: "Train Model",
        ariaLabel: "test aria label for node Train Model",
        data: {
            comment: "",
            iconName: "ModelingView",
            status: "running",
            startTime: "2020-04-23T04:47:39.2788188Z",
            endTime: "2020-04-23T04:48:15.9737746Z"
        },
        ports: [{
            id: "port-0",
            name: "Untrained_model",
            ariaLabel: "test aria label for port Untrained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            shape: "modulePort",
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            ariaLabel: "test aria label for port Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            shape: "modulePort",
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Trained_model",
            ariaLabel: "test aria label for port Trained_model",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.5, 1]
        }]
    }, {
        id: "c4ee5025",
        x: 491,
        y: 630,
        name: "Score Model",
        ariaLabel: "test aria label for node Score Model",
        data: {
            comment: "",
            iconName: "WebAppBuilderModule",
            status: "running",
            startTime: "2020-04-23T04:48:46.9127704Z",
            endTime: "2020-04-23T04:49:21.8385195Z"
        },
        ports: [{
            id: "port-0",
            name: "Trained_model",
            ariaLabel: "test aria label for port Trained_model",
            isInputDisabled: false,
            isOutputDisabled: true,
            shape: "modulePort",
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Dataset",
            ariaLabel: "test aria label for port Dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            shape: "modulePort",
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Scored_dataset",
            ariaLabel: "test aria label for port Scored_dataset",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.5, 1]
        }]
    }, {
        id: "81777c66",
        x: 493,
        y: 738,
        name: "Evaluate Model",
        ariaLabel: "test aria label for node Evaluate Model",
        data: {
            comment: "",
            iconName: "WebAppBuilderModule",
            status: "running",
            startTime: "2020-04-23T04:49:50.4901091Z",
            endTime: "2020-04-23T04:50:22.7228023Z"
        },
        ports: [{
            id: "port-0",
            name: "Scored_dataset",
            ariaLabel: "test aria label for port Scored_dataset",
            isInputDisabled: false,
            isOutputDisabled: true,
            shape: "modulePort",
            position: [0.3333333333333333, 0]
        }, {
            id: "port-1",
            name: "Scored_dataset_to_compare",
            ariaLabel: "test aria label for port Scored_dataset_to_compare",
            isInputDisabled: false,
            isOutputDisabled: true,
            shape: "modulePort",
            position: [0.6666666666666666, 0]
        }, {
            id: "port-2",
            name: "Evaluation_results",
            ariaLabel: "test aria label for port Evaluation_results",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.5, 1]
        }]
    }, {
        id: "1fd27f80",
        x: 544,
        y: 49,
        name: "Automobile price data (Raw)",
        ariaLabel: "test aria label for node Automobile price data (Raw)",
        data: {
            comment: "",
            iconName: "Database",
            status: "running"
        },
        ports: [{
            id: "port-0",
            name: "DatasetOutput",
            ariaLabel: "test aria label for port DatasetOutput",
            isInputDisabled: true,
            isOutputDisabled: false,
            shape: "modulePort",
            position: [0.5, 1]
        }]
    }],
    edges: [{
        source: "d1647408",
        target: "fb404f70",
        sourcePortId: "port-1",
        targetPortId: "port-1",
        id: "0"
    }, {
        source: "47566002",
        target: "f6dc0eb1",
        sourcePortId: "port-1",
        targetPortId: "port-0",
        id: "1"
    }, {
        source: "f6dc0eb1",
        target: "d1647408",
        sourcePortId: "port-1",
        targetPortId: "port-0",
        id: "2"
    }, {
        source: "4b199015",
        target: "fb404f70",
        sourcePortId: "port-0",
        targetPortId: "port-0",
        id: "3"
    }, {
        source: "fb404f70",
        target: "c4ee5025",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "4"
    }, {
        source: "d1647408",
        target: "c4ee5025",
        sourcePortId: "port-2",
        targetPortId: "port-1",
        id: "5"
    }, {
        source: "c4ee5025",
        target: "81777c66",
        sourcePortId: "port-2",
        targetPortId: "port-0",
        id: "6"
    }, {
        source: "1fd27f80",
        target: "47566002",
        sourcePortId: "port-0",
        targetPortId: "port-0",
        id: "7"
    }]
};