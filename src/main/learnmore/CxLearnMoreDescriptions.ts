import CxLearnMoreSamples from "./CxLearnMoreSamples";

export default class CxLearnMoreDescriptions {
    queryId: string;
    queryName: string;
    queryDescriptionId: string;
    resultDescription: string;
    risk: string;
    cause: string;
    generalRecommendations: string;
    samples: CxLearnMoreSamples[];

    static parseLearnMoreDescriptionsResponse(result: any): CxLearnMoreDescriptions {
        const cxLearnMoreDescriptions = new CxLearnMoreDescriptions();
        cxLearnMoreDescriptions.queryId = result.queryId;
        cxLearnMoreDescriptions.queryName = result.queryName;
        cxLearnMoreDescriptions.queryDescriptionId = result.queryDescriptionId;
        cxLearnMoreDescriptions.resultDescription = result.resultDescription;
        cxLearnMoreDescriptions.risk = result.risk;
        cxLearnMoreDescriptions.cause = result.cause;
        cxLearnMoreDescriptions.generalRecommendations = result.generalRecommendations;
        cxLearnMoreDescriptions.samples = result.samples;
        return cxLearnMoreDescriptions;
    }

}