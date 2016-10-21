import {ApiEdgeDefinition} from "../ApiEdgeDefinition";
import {ApiEdgeQuery} from "../ApiEdgeQuery";
import {ApiEdgeQueryType} from "../ApiEdgeQueryType";
import {ApiEdgeRelation} from "./ApiEdgeRelation";

export class OneToOneRelation implements ApiEdgeRelation {

    name: string;
    relationId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;

    constructor(name: string, from: ApiEdgeDefinition, to: ApiEdgeDefinition, relationId: string = null) {
        this.name = name;
        this.from = from;
        this.to = to;
        this.relationId = relationId || this.to.name + "Id";
    }

    private createExistsQuery = (relatedId: string): ApiEdgeQuery => {
        return new ApiEdgeQuery(this.to, ApiEdgeQueryType.Exists, { id: relatedId });
    };

    private createGetQuery = (relatedId: string): ApiEdgeQuery => {
        return new ApiEdgeQuery(this.to, ApiEdgeQueryType.Get, { id: relatedId });
    };

    query = (relatedId: string, queryItems: string[]): ApiEdgeQuery => {
        if(queryItems[0] === this.name) queryItems.shift();
        else return null;

        if(queryItems.length) {
            return this.createExistsQuery(relatedId);
        }
        else {
            return this.createGetQuery(relatedId);
        }
    }
}