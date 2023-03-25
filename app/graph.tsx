'use client'; // Client side rendering required since we are using clientside specific hooks

import CytoscapeComponent from 'react-cytoscapejs'
import Spread from 'cytoscape-spread';
import COSEBilkent from 'cytoscape-cose-bilkent'
import cola from 'cytoscape-cola';

import { useState, useEffect } from 'react';
import cytoscape, { EventObject } from 'cytoscape';
import Cytoscape from 'cytoscape';
import { randomUUID } from 'crypto';
import { GetNeighborsDocument, IsDependency,  GetPkgQuery, GetPkgQueryVariables, PkgSpec , GetPkgDocument, AllPkgTreeFragment, Package, PackageNamespace, PackageName, PackageVersion ,CertifyPkg} from '../gql/__generated__/graphql';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import client from 'apollo/client'



Cytoscape.use(Spread);
Cytoscape.use(COSEBilkent);
Cytoscape.use(cola);

export type Node = {
  data: {
    id: string;
    label: string;
    type: string;
  };
}

export type Edge = {
  data: {
    source: string;
    target: string;
    label: string;
    id?: string;
  };
}

type GraphData = {
  nodes: Node[];
  edges: Edge[];
}

type GraphProps = {
  graphData?: GraphData;
  layout?: string;
  writeDetails?: (x: any) => void;
};


// parse* returns a set of GraphData that consists of the nodes and edges to create a subgraph
// it also returns the node which is the main node to link to of the subgraph
function parsePackage(n: Package) : [GraphData, Node | undefined] {
  let nodes : Node[] = [];
  let edges : Edge[] = [];
  // for each check if its the leaf, and if its the leaf that's where the edge goes
  let target : Node | undefined = undefined;


  const typ : Package = n;
  nodes = [...nodes, {data: {id: typ.id, label: typ.type, type: "package"}}];
  if (typ.namespaces.length == 0) {
    target = nodes.at(-1);
  }

  typ.namespaces.forEach((ns : PackageNamespace) =>{
    nodes = [...nodes, {data: {id: ns.id, label: ns.namespace, type: "package"}}];
    edges = [...edges, {data: {source:typ.id, target:ns.id, label:"pkgNs"}}]
    if (ns.names.length == 0) {
      target = nodes.at(-1);
    }

    ns.names.forEach((name: PackageName)=>{
      nodes = [...nodes, {data: {id: name.id, label: name.name, type: "package"}}];
      edges = [...edges, {data: { source:ns.id, target:name.id, label:"pkgName"}}]
      if (name.versions.length == 0) {
        target = nodes.at(-1);
      }

      name.versions.forEach((version: PackageVersion) => {
        nodes = [...nodes, {data: {id: version.id, label: version.version, type: "package"}}];
        edges = [...edges, {data: { source:name.id, target:version.id, label:"pkgVersion"}}]
        target = nodes.at(-1);
      });
    });
  });
  return [ { nodes: nodes, edges: edges }, target];
}

class GuacNode {
  nodeId: number;
  nodeType: string;
  data: undefined;

  constructor(nodeData: any) {

    // parse graphql data and determine what the node id and nodeType is and put the entire dict in data for JSON output
    this.nodeId = nodeData.nodeId;
    this.nodeType = "something";
    this.data = nodeData;
  }
}

type NodeId = number;

class GuacGraphHelper {
  frontier: GuacNode[];
  nodeMap: Map<number,GuacNode>;
  expandedMap: Map<number,boolean>;

  constructor(message: string) {
    this.frontier = [];
    this.nodeMap = new Map<NodeId, GuacNode>;
    this.expandedMap = new Map<NodeId, boolean>;
  }
  // populateData will take a node and figure out the other nodes and edges to create and
  // - update the frontier by removing itself and adding the new nodes
  // - adding the new nodes to the nodeMap
  // - adding the new nodes and edges to cytoscape graph
  private populateData (node:GuacNode) {

  }

  public expandNode(id: NodeId) {
    const n = this.getNodeEdges(id);
    // check if n is null and populate if it is not.
    this.populateData(n);
  }

  public getNodeEdges(id: NodeId) : GuacNode {
    // check if it is in expnaded map, if its not been expanded, query for node (with its edge properties), else return null
    return new GuacNode({});
  }

  public expandFrontier() {
    const currentFrontier = Object.assign([], this.frontier);
    currentFrontier.forEach((n)=>
      this.expandNode(n)
    );
  }
}


function guacToCy(n:GuacNode):  Node {
  return {
    data : {
      id: n.nodeId.toString(),
      label: n.nodeType,
      type: n.nodeType,
    }
  }
}



const defaultGraphData: GraphData = {
  nodes: [
    { data: { id: "1", label: "Identity 1", type: "id" } },
    { data: { id: "2", label: "Software 1", type: "software" } },
    { data: { id: "3", label: "Identity 2", type: "id" } },
    { data: { id: "4", label: "Software 2", type: "software" } },
    { data: { id: "5", label: "Software 3", type: "software" } },
    { data: { id: "6", label: "Identity 3", type: "id" } },
    { data: { id: "7", label: "Software 5", type: "software" } },
    { data: { id: "8", label: "Software 6", type: "software" } },
    { data: { id: "9", label: "Software 7", type: "software" } },
    { data: { id: "10", label: "Software 8", type: "software" } },
    { data: { id: "11", label: "Software 9", type: "software" } },
    { data: { id: "12", label: "Identity 3", type: "id" } },
    { data: { id: "13", label: "Software 10", type: "software" } }
  ],
  edges: [
    {
      data: { source: "1", target: "2", label: "Node2" }
    },
    {
      data: { source: "3", target: "4", label: "Node4" }
    },
    {
      data: { source: "3", target: "5", label: "Node5" }
    },
    {
      data: { source: "6", target: "5", label: " 6 -> 5" }
    },
    {
      data: { source: "6", target: "7", label: " 6 -> 7" }
    },
    {
      data: { source: "6", target: "8", label: " 6 -> 8" }
    },
    {
      data: { source: "6", target: "9", label: " 6 -> 9" }
    },
    {
      data: { source: "3", target: "13", label: " 3 -> 13" }
    }
  ]
};

let refCy :cytoscape.Core;
export default function Graph(props: GraphProps) {
  

  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("800px");
  const [dataCount, setDataCount] = useState(0);

  const [graphDesiredState, setGraphDesiredState] = useState([1,2,3,4,5,6,7,8,9,10,11,12]);
  const [neighborsDesired, setNeighborsDesired] = useState([]);
  const [gotNeighbors, setGotNeighbors] = useState(new Set<number>());



  //const [graphData, setGraphData] = useState(props?.graphData ?? defaultGraphData);
  const graphData = props.graphData;
  


  
  //console.log(props.graphData)
  const layout = {
    name: props?.layout ?? "breadthfirst",
    fit: true,
    directed: true,
    padding: 50,
    idealEdgeLength: 100,
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: false,
  }
  //refCy.layout(layout).run()
  
  useEffect(() => {
    // some bad heuristic to run data once new data is found
    if (graphData != undefined && dataCount != graphData.nodes.length) {
      refCy.layout(layout).run();
      setDataCount(graphData.nodes.length);
    }
  });
  /*
  function handleNeighbors(results) {
    results.forEach(
      console.log(refCy);
      console.log("gds loop" + graphDesiredState[i]);
      console.log(graphDesiredState);
      
  

      if (refCy != undefined) {
        if (!refCy.hasElementWithId(graphDesiredState[i].toString())) {
        
          
          client.query({
            query: GetPkgDocument,
            variables: {
              spec: JSON.parse(`{
                "type":"deb",
                "namespace":"ubuntu",
                "name": "dpkg",
                "qualifiers": [{"key":"arch", "value":"amd64"}]
              }`),
            }
          }).then(result => {
            if (!refCy.hasElementWithId(graphDesiredState[i].toString())) {
            refCy.add({data: { id: graphDesiredState[i].toString(), label: "node-" + graphDesiredState[i].toString()}});
            refCy.layout(layout).run();
            }
            console.log(graphDesiredState[i].toString() + result);
          }
          );
          
        } else {
          console.log("updated all existing nodes");
          break;
        }
      } else {
        console.log("cy not initialized yet");
      }

    }
    
  }
  */

  const styleSheet = [
    {
      selector: "node",
      style: {
        backgroundColor: "#4a56a6",
        width: 30,
        height: 30,
        label: "data(label)",
        "overlay-padding": "6px",
        "z-index": "10",
        //text props
        "text-outline-color": "#4a56a6",
        "text-outline-width": "2px",
        color: "white",
        fontSize: 20
      }
    },
    {
      selector: "node:selected",
      style: {
        "border-width": "6px",
        "border-color": "#AAD8FF",
        "border-opacity": "0.5",
        "background-color": "#77828C",
        width: 30,
        height: 30,
        //text props
        "text-outline-color": "#77828C",
        "text-outline-width": 8
      }
    },
    {
      selector: "node[type='software']",
      style: {
        shape: "rectangle"
      }
    },
    {
      selector: "node[type='id']",
      style: {
        shape: "triangle",
        "background-color": "#EB3434"
      }
    },
    {
      selector: "edge",
      style: {
        width: 3,
        'text-rotation': 'autorotate',
        'text-margin-y': '-10px',
        'text-background-color': '#fff',
        'text-background-opacity': 0.7,
        'text-background-padding': '1px',
        'text-background-shape': 'roundrectangle',
        'text-border-color': '#000',
        'text-border-opacity': 0.1,
        'text-border-width': '0.5px',
        "label": "data(label)",
        "line-color": "#AAD8FF",
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier"
      }
    }
  ];
  /*
  for (let i=graphDesiredState.length-1;i>=0;  i--) {
    console.log(refCy);
    console.log("gds loop" + graphDesiredState[i]);
    console.log(graphDesiredState);
    
    const found =  graphData.nodes.find((a)=>a.data.id  == graphDesiredState[i].toString());
    //console.log(graphDesiredState);
    //console.log(graphData.nodes);
    //if (found != undefined) {
    //  console.log("updated all existing nodes");
    //  break;
    //}

    if (refCy != undefined) {
      if (!refCy.hasElementWithId(graphDesiredState[i].toString())) {
      
        
        client.query({
          query: GetPkgDocument,
          variables: {
            spec: JSON.parse(`{
              "type":"deb",
              "namespace":"ubuntu",
              "name": "dpkg",
              "qualifiers": [{"key":"arch", "value":"amd64"}]
            }`),
          }
        }).then(result => {
          if (!refCy.hasElementWithId(graphDesiredState[i].toString())) {
          refCy.add({data: { id: graphDesiredState[i].toString(), label: "node-" + graphDesiredState[i].toString()}});
          refCy.layout(layout).run();
          }
          console.log(graphDesiredState[i].toString() + result);
        }
        );
        
      } else {
        console.log("updated all existing nodes");
        break;
      }
    } else {
      console.log("cy not initialized yet");
    }

  }
  */

  let nodeTapHandler = (evt: EventObject) => {
    var node = evt.target;
    // TODO: This should potentially run additional queries that then update the component state
    //let rnd = Math.floor(Math.random() * (1000 - 100 + 1) + 100);
    //console.log(graphDesiredState);
    //setGraphDesiredState([...graphDesiredState, rnd]);


    
    if (props.writeDetails != undefined) {
      props.writeDetails(node.data());
    }    
  }


  let nodeCxttapHandler = (evt: EventObject) => {
    var node = evt.target;
    // TODO: This should potentially run additional queries that then update the component state
    console.log("EVT", evt.target.id());

    client.query({
      query: GetNeighborsDocument,
      fetchPolicy: "no-cache" ,
      variables: { nodeId: evt.target.id()},
    },
    ).then(result => {
      console.log(evt.target.id(), "neighbors", result.data);
      
      

      const neighbors = result.data.neighbors;
      neighbors.forEach((n) => {
          let gd : GraphData;
          let target : Node | undefined;

          switch (n.__typename) {
            case "Package":
              [gd, target]  = parsePackage(n as Package);
              break;
            case "CertifyPkg":
              /* TODO::: NEED TO ADD TO GRAPHQL TREE FRAGMENT
              const cpkg : CertifyPkg = n;
              nodes = [...nodes, {data: {
                label: "certifyPkg",
                type: "certifyPkg",
                id: cpkg.id,
                
              }}];
              */
              // expand mutual call back to pkgs
            default:
              // not handled
              console.log("unhandled node type:", n.__typename);
              return;
              
          }

          gd.nodes.forEach((nn) =>{
            if (!refCy.hasElementWithId(nn.data.id)) {
              refCy.add(nn);
            }
          });

          gd.edges.forEach((e) =>{
            e.data.id = e.data.source + "->" + e.data.target;
            if (!refCy.hasElementWithId(e.data.id)) {
              refCy.add(e);
            }
          });
          refCy.layout(layout).run();

      });
      
      
    });

  }


  let addNode = () => {
    console.log("add innode");
    console.log(graphData);
    console.log(refCy);
    console.log(refCy.json());
    //refCy.add({ data: { id: "abc",label: "FJIOEJIOWFJEIOWJFOEIWFJEIOWJFEWOFIJEIOF 10", type: "fewafawefawef" } });
    //graphData.nodes.push({ data: { id: "abc",label: "FJIOEJIOWFJEIOWJFOEIWFJEIOWJFEWOFIJEIOF 10", type: "fewafawefawef" } });
    //setGraphData(graphData);
    
  }

  return (
    <>
    <button onClick={addNode}> add node </button>
    <CytoscapeComponent
      elements={CytoscapeComponent.normalizeElements(graphData)}
      style={{ width: width, height: height }}
      zoomingEnabled={true}
      maxZoom={3}
      minZoom={0.1}
      autounselectify={false}
      boxSelectionEnabled={true}
      layout={layout}
      stylesheet={styleSheet}
      cy={cy => {
        refCy = cy;
        cy.on("tap", "node", evt => nodeTapHandler(evt));
        cy.on("cxttap", "node", evt => nodeCxttapHandler(evt));
      }}
    />
    </>
  )
}
