import {ApiEdgeRelation} from "../relations/ApiEdgeRelation";
import {ApiEdgeQueryContext} from "./ApiEdgeQueryContext";
import {ApiEdgeQueryResponse} from "./ApiEdgeQueryResponse";
import {ApiQueryScope} from "../query/ApiQuery";
import {ApiEdgeMethod, ApiEdgeMethodScope} from "./ApiEdgeMethod";
import {ApiRequestType} from "../request/ApiRequest";

export interface ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;

    fields: string[];
    methods: ApiEdgeMethod[];
    relations: ApiEdgeRelation[];

    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    callMethod: (scope: ApiQueryScope) => Promise<ApiQueryScope>;
}

export abstract class ApiEdge implements ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;

    fields: string[] = [];
    methods: ApiEdgeMethod[] = [];
    relations: ApiEdgeRelation[] = [];

    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    callMethod: (scope: ApiQueryScope) => Promise<ApiQueryScope>;

    edgeMethod = (name: string,
                  execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>,
                  acceptedTypes: ApiRequestType = ApiRequestType.Any): ApiEdge => {
        if(this.methods.find((method: ApiEdgeMethod) =>
            method.name === name))
           throw "A method with the same name already exists.";

        this.methods.push(new ApiEdgeMethod(name, execute, ApiEdgeMethodScope.Edge, acceptedTypes));
        return this
    };

    collectionMethod = (name: string,
                        execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>,
                        acceptedTypes: ApiRequestType = ApiRequestType.Any): ApiEdge => {
        if(this.methods.find((method: ApiEdgeMethod) =>
            method.name === name &&
            (method.scope == ApiEdgeMethodScope.Collection || method.scope == ApiEdgeMethodScope.Edge)))
            throw "A collection method with the same name already exists.";

        this.methods.push(new ApiEdgeMethod(name, execute, ApiEdgeMethodScope.Collection, acceptedTypes));
        return this
    };

    entryMethod = (name: string,
                   execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>,
                   acceptedTypes: ApiRequestType = ApiRequestType.Any): ApiEdge => {
        if(this.methods.find((method: ApiEdgeMethod) =>
            method.name === name &&
            (method.scope == ApiEdgeMethodScope.Entry || method.scope == ApiEdgeMethodScope.Edge)))
            throw "An entry method with the same name already exists.";

        this.methods.push(new ApiEdgeMethod(name, execute, ApiEdgeMethodScope.Entry, acceptedTypes));
        return this
    };
}