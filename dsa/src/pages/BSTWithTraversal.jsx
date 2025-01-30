import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import Button from "../components/Button";

/** 1) DAGRE LAYOUT HELPER */
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Basic node size for the layout algorithm
  const nodeWidth = 80;
  const nodeHeight = 80;

  // "TB" = top-to-bottom; "LR" = left-to-right; etc.
  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: 100, // vertical gap
    nodesep: 50,  // horizontal gap
  });

  // Add nodes to Dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to Dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Run the Dagre layout
  dagre.layout(dagreGraph);

  // Update each node's position from Dagre
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    let { x, y } = dagreNode;

    // 2) OPTIONAL NUDGE BASED ON "SIDE"
    // If this node is a left or right child, shift it slightly.
    if (node.data.side === "left") {
      x -= 15; // push left children slightly left
    } else if (node.data.side === "right") {
      x += 15; // push right children slightly right
    }
    // End optional nudge

    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
    };
  });

  return { nodes: layoutedNodes, edges };
};

/** BST Node Structure */
class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

/** Binary Search Tree with insert method */
class BST {
  constructor() {
    this.root = null;
  }

  insert(val) {
    if (!this.root) {
      this.root = new BSTNode(val);
      return;
    }
    this._insertNode(this.root, val);
  }

  _insertNode(node, val) {
    if (val < node.val) {
      // go left
      if (!node.left) node.left = new BSTNode(val);
      else this._insertNode(node.left, val);
    } else {
      // go right
      if (!node.right) node.right = new BSTNode(val);
      else this._insertNode(node.right, val);
    }
  }
}

/** Main BST component with form on the left and ReactFlow on the right */
const BinarySearchTree = () => {
  // For user input
  const [userInput, setUserInput] = useState("");
  const [values, setValues] = useState([]); 

  // The BST instance
  const [tree, setTree] = useState(new BST());

  // ReactFlow node/edge states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // ReactFlow instance
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Traversal state
  const [traversalResult, setTraversalResult] = useState("");
  const traversalIntervalRef = useRef(null);

  // Modal for traversal type
  const [isTraversalModalOpen, setIsTraversalModalOpen] = useState(false);

  useEffect(() => {
    document.title = "BST with Traversal";
  }, []);

  // Clear any traversal highlight
  const clearTraversal = () => {
    if (traversalIntervalRef.current) {
      clearInterval(traversalIntervalRef.current);
      traversalIntervalRef.current = null;
    }
    setTraversalResult("");
  };

  /** Build or rebuild the BST from values array */
  const rebuildBST = (arr) => {
    const newTree = new BST();
    arr.forEach((val) => newTree.insert(val));
    return newTree;
  };

  /** Insert a single value from user input */
  const handleInsert = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const num = parseInt(userInput, 10);
    if (Number.isNaN(num)) {
      alert("Please enter a valid integer!");
      return;
    }
    if (values.length >= 30) {
      alert("Maximum of 30 integers reached!");
      return;
    }

    setValues((prev) => [...prev, num]);
    setUserInput("");
  };

  /** Clear all integers */
  const handleClear = () => {
    clearTraversal();
    setValues([]);
    setTree(new BST());
    setNodes([]);
    setEdges([]);
  };

  /**
   * Build a node/edge list from the BST, ignoring (x,y).
   * We do BFS *only* to create unique IDs and track "left" or "right" side.
   */
  const buildFlowFromBST = (root) => {
    const newNodes = [];
    const newEdges = [];

    if (!root) return { newNodes, newEdges };

    // We'll do BFS with a queue item = { node, id, side }
    // "side" can be "root", "left", or "right"
    const queue = [{ node: root, id: "1", side: "root" }];

    while (queue.length > 0) {
      const { node, id, side } = queue.shift();

      // Create this node with side info
      newNodes.push({
        id,
        data: { label: node.val, side },
        position: { x: 0, y: 0 }, // placeholder
        style: {
          background: "#FFDE00",
          color: "black",
          borderRadius: "50%",
          width: 60,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });

      // If left child, push queue with side = "left"
      if (node.left) {
        const leftId = `${id}L`;
        newEdges.push({
          id: `e${id}-${leftId}`,
          source: id,
          target: leftId,
          animated: true,
          style: { stroke: "black", strokeWidth: 4, strokeDasharray: 5 },
        });
        queue.push({
          node: node.left,
          id: leftId,
          side: "left",
        });
      }

      // If right child, push queue with side = "right"
      if (node.right) {
        const rightId = `${id}R`;
        newEdges.push({
          id: `e${id}-${rightId}`,
          source: id,
          target: rightId,
          animated: true,
          style: { stroke: "black", strokeWidth: 4, strokeDasharray: 5 },
        });
        queue.push({
          node: node.right,
          id: rightId,
          side: "right",
        });
      }
    }

    return { newNodes, newEdges };
  };

  // Rebuild tree when values changes
  useEffect(() => {
    const newTree = rebuildBST(values);
    setTree(newTree);

    // (1) Build node/edge lists without x/y
    const { newNodes, newEdges } = buildFlowFromBST(newTree.root);

    // (2) Let Dagre compute positions
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      "TB" 
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    // eslint-disable-next-line
  }, [values]);

  // Auto-fit after nodes/edges update
  useEffect(() => {
    if (reactFlowInstance && nodes.length) {
      reactFlowInstance.fitView({
        padding: 0.2,
        includeHiddenNodes: true,
        duration: 800,
      });
    }
  }, [nodes, reactFlowInstance]);

  // Traversal helpers
  const preorder = (node, list = []) => {
    if (!node) return list;
    list.push(node.val);
    preorder(node.left, list);
    preorder(node.right, list);
    return list;
  };
  const inorder = (node, list = []) => {
    if (!node) return list;
    inorder(node.left, list);
    list.push(node.val);
    inorder(node.right, list);
    return list;
  };
  const postorder = (node, list = []) => {
    if (!node) return list;
    postorder(node.left, list);
    postorder(node.right, list);
    list.push(node.val);
    return list;
  };

  // Reset node colors
  const resetNodeColors = () => {
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        style: {
          ...node.style,
          background: "#FFDE00",
          color: "white",
        },
      }))
    );
  };

  // Handle traversal selection
  const handleTraversalSelect = (type) => {
    clearTraversal();
    if (!tree.root) {
      alert("Please insert at least one value to build a BST!");
      return;
    }

    resetNodeColors();

    let order = [];
    if (type === "Preorder") {
      // TLR
      order = preorder(tree.root);
    } else if (type === "Inorder") {
      // LTR
      order = inorder(tree.root);
    } else {
      // Postorder (LRT)
      order = postorder(tree.root);
    }

    let current = 0;
    traversalIntervalRef.current = setInterval(() => {
      if (current >= order.length) {
        clearTraversal();
        setTraversalResult(order.join(" -> "));
        return;
      }

      const prevVal = order[current - 1];
      const currentVal = order[current];

      // Animate highlight
      setNodes((prev) =>
        prev.map((n) => {
          if (prevVal !== undefined && n.data.label === prevVal) {
            return {
              ...n,
              style: {
                ...n.style,
                background: "#b71c1c",
              },
            };
          }
          if (currentVal !== undefined && n.data.label === currentVal) {
            return {
              ...n,
              style: {
                ...n.style,
                background: "#ff5722",
              },
            };
          }
          return n;
        })
      );

      setTraversalResult(order.slice(0, current + 1).join(" -> "));
      current++;
    }, 1000);

    setIsTraversalModalOpen(false);
  };

  return (
    <div className="w-full h-screen flex">
      {/* LEFT: input form */}
      <div className="bg-secondary w-1/4 p-4 border-r border-gray-300 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2 ml-14">BST Input</h2>
        <form onSubmit={handleInsert} className="flex flex-row gap-2">
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter integer"
            className="p-2 border border-black bg-transparent rounded focus:outline-none w-full"
          />
          <Button
            variant="primary"
            type="submit"
            className="text-dark px-4 py-2 rounded hover:bg-red-600"
          >
            Insert
          </Button>
        </form>

        <div className="text-sm">
          <p className="font-semibold">Values in BST:</p>
          <p>{values.join(", ") || "No values inserted yet."}</p>
        </div>

        <div className="flex flex-row gap-2 mt-auto">
          <Button
            variant="danger"
            onClick={() => setIsTraversalModalOpen(true)}
            className="text-dark px-4 py-2 bg-red-500 rounded hover:bg-red-600"
          >
            Choose Traversal
          </Button>
          <Button
          variant="danger"
            onClick={handleClear}
            className="bg-gray-500 text-dark px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* RIGHT: ReactFlow visualization */}
      <div className="w-3/4 h-full relative">
        {/* Traversal result display */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 py-2 px-4 rounded shadow z-10">
          <span className="block text-sm text-gray-800">
            {traversalResult || ""}
          </span>
        </div>

        {/* Modal for Traversal Type */}
        {isTraversalModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
              <h2 className="text-2xl font-bold mb-4">Choose Traversal Type</h2>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => handleTraversalSelect("Preorder")}
                  className="bg-red-800 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition"
                >
                  Preorder (TLR)
                </button>
                <button
                  onClick={() => handleTraversalSelect("Inorder")}
                  className="bg-red-800 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition"
                >
                  Inorder (LTR)
                </button>
                <button
                  onClick={() => handleTraversalSelect("Postorder")}
                  className="bg-red-800 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition"
                >
                  Postorder (LRT)
                </button>
                <button
                  onClick={() => setIsTraversalModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={setReactFlowInstance}
          fitView
          ref={reactFlowWrapper}
          panOnDrag
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          className="w-full h-full bg-secondary-light"
        >
          <Background color="#800000" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default BinarySearchTree;
