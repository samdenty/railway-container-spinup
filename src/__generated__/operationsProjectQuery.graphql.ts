/**
 * @generated SignedSource<<6e5bc8243f2cb2810eb73d51d523cd26>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type operationsProjectQuery$variables = {
  id: string;
};
export type operationsProjectQuery$data = {
  readonly project: {
    readonly description: string | null | undefined;
    readonly environments: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly name: string;
        };
      }>;
    };
    readonly id: string;
    readonly name: string;
    readonly services: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly icon: string | null | undefined;
          readonly id: string;
          readonly name: string;
          readonly updatedAt: any;
        };
      }>;
    };
    readonly updatedAt: any;
  };
};
export type operationsProjectQuery = {
  response: operationsProjectQuery$data;
  variables: operationsProjectQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Project",
    "kind": "LinkedField",
    "name": "project",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      (v3/*: any*/),
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 20
          }
        ],
        "concreteType": "ProjectEnvironmentsConnection",
        "kind": "LinkedField",
        "name": "environments",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ProjectEnvironmentsConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Environment",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "environments(first:20)"
      },
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 50
          }
        ],
        "concreteType": "ProjectServicesConnection",
        "kind": "LinkedField",
        "name": "services",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ProjectServicesConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Service",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "icon",
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "services(first:50)"
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "operationsProjectQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "operationsProjectQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "24fe558bcfa5fad2cff119a86683e10a",
    "id": null,
    "metadata": {},
    "name": "operationsProjectQuery",
    "operationKind": "query",
    "text": "query operationsProjectQuery(\n  $id: String!\n) {\n  project(id: $id) {\n    id\n    name\n    description\n    updatedAt\n    environments(first: 20) {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n    services(first: 50) {\n      edges {\n        node {\n          id\n          name\n          icon\n          updatedAt\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "852bc498d5b479eee4cea1b29b2cd4c0";

export default node;
