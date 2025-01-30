import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { motion } from "framer-motion";
import "reactflow/dist/style.css";
import Button from "../components/Button";

const AnimatedNode = ({ id, data, position, style }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        ...style,
        position: "absolute",
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="flex items-center justify-center rounded-full bg-red-800 text-white w-15 h-15"
    >
      {data.label}
    </motion.div>
  );
};

const BinaryTreeTraversal = () => {
  const [levels, setLevels] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // State for traversal modal
  const [isTraversalModalOpen, setIsTraversalModalOpen] = useState(false);
  const [traversalType, setTraversalType] = useState("");
  const [traversalResult, setTraversalResult] = useState("");

  const traversalIntervalRef = useRef(null);

  // Refit the view whenever nodes change using ReactFlow's fitView
  useEffect(() => {
    if (reactFlowInstance && nodes.length) {
      reactFlowInstance.fitView({
        padding: 0.2,
        includeHiddenNodes: false,
        duration: 800,
        easing: (t) => t,
      });
    }
  }, [nodes, reactFlowInstance]);

  const clearTraversal = () => {
    if (traversalIntervalRef.current) {
      clearInterval(traversalIntervalRef.current);
      traversalIntervalRef.current = null;
    }
    setTraversalResult(""); 
  };

  // Define the fitView function
  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({
        padding: 0.2,
        includeHiddenNodes: false,
        duration: 800,
        easing: (t) => t,
      });
    }
  };

  const createTree = (levels) => {
    clearTraversal();

    if (levels < 1 || levels > 5) {
      alert("Levels must be between 1 and 5!");
      return;
    }
    

    // Clear existing nodes and edges
    setNodes([]);
    setEdges([]);

    const baseHorizontalSpacing = 500 + 100 * (levels - 1); // Dynamic spacing
    const verticalSpacing = 200;

    const generateTreeData = (
      level,
      value = 1,
      x = 0,
      y = 0,
      parentId = null
    ) => {
      if (level > levels) return { nodes: [], edges: [] };

      const horizontalSpacing = baseHorizontalSpacing / Math.pow(2, level);
      const nodeId = value.toString();

      const node = {
        id: nodeId,
        data: { label: `Node ${value}` },
        position: { x, y },
        style: {
          background: "#FFDE00",
          color: "black",
          borderRadius: "50%",
          width: 60,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Cabin",
        }, 
        rightOrLeft: parentId ? (value % 2 === 0 ? "left" : "right") : "root",
      };

      const edges = [];
      if (parentId) {
        edges.push({
          id: `e${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          animated: true,
          style: { stroke: "black", strokeWidth: 4, strokeDasharray: 5 },
        });
      }

      const leftChild = generateTreeData(
        level + 1,
        value * 2,
        x - horizontalSpacing,
        y + verticalSpacing,
        nodeId
      );
      const rightChild = generateTreeData(
        level + 1,
        value * 2 + 1,
        x + horizontalSpacing,
        y + verticalSpacing,
        nodeId
      );

      return {
        nodes: [node, ...leftChild.nodes, ...rightChild.nodes],
        edges: [...edges, ...leftChild.edges, ...rightChild.edges],
      };
    };

    const treeData = generateTreeData(1, 1, 0, 0);
    let time;
    if (levels === 1) {
      time = 400;
    } else if (levels === 2) {
      time = 650;
    } else if (levels === 3) {
      time = 950;
    } else if (levels === 4) {
      time = 1250;
    } else {
      time = 1550;
    }
    animateTreeConstruction(treeData.nodes, treeData.edges, levels);
    setTimeout(() => {
      handleFitView();
    }, time);
  };

  const animateTreeConstruction = (nodesData, edgesData, levels = 1) => {
    setNodes([]);
    setEdges([]);
    let currentLevel = 0;
    const maxLevel = Math.max(
      ...nodesData.map((node) => parseInt(node.id, 10).toString(2).length)
    );

    let time = 300;
    const interval = setInterval(() => {
      if (currentLevel >= maxLevel) {
        clearInterval(interval);
        return;
      }

      const newNodes = nodesData.filter(
        (node) =>
          parseInt(node.id, 10).toString(2).length === currentLevel + 1
      );
      const newEdges = edgesData.filter(
        (edge) =>
          parseInt(edge.source, 10).toString(2).length === currentLevel &&
          parseInt(edge.target, 10).toString(2).length === currentLevel + 1
      );

      setNodes((prev) => [...prev, ...newNodes]);
      setEdges((prev) => [...prev, ...newEdges]);

      currentLevel++;
    }, time);
  };

  const handleGenerate = () => {
    createTree(levels);
    setIsModalOpen(false);
    // Reset traversal result when a new tree is generated
    setTraversalResult("");
  };

  const nodeTypes = {
    animatedNode: AnimatedNode,
  };

  // Helper function to build a tree structure from nodes
  const buildTree = () => {
    if (nodes.length === 0) return null;

    const nodeMap = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = { value: parseInt(node.id, 10), left: null, right: null };
    });

    edges.forEach((edge) => {
      const source = edge.source;
      const target = edge.target;
      if (parseInt(target, 10) === parseInt(source, 10) * 2) {
        nodeMap[source].left = nodeMap[target];
      } else if (parseInt(target, 10) === parseInt(source, 10) * 2 + 1) {
        nodeMap[source].right = nodeMap[target];
      }
    });

    return nodeMap["1"] || null; // Assuming "1" is the root
  };

  // Traversal functions
  const preorderTraversal = (node, result = []) => {
    if (!node) return result;
    result.push(node.value);
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
    return result;
  };

  const inorderTraversal = (node, result = []) => {
    if (!node) return result;
    inorderTraversal(node.left, result);
    result.push(node.value);
    inorderTraversal(node.right, result);
    return result;
  };

  const postorderTraversal = (node, result = []) => {
    if (!node) return result;
    postorderTraversal(node.left, result);
    postorderTraversal(node.right, result);
    result.push(node.value);
    return result;
  };

  // if I change my mind
  // const handleTraversalSelect = (type) => {
  // clearTraversal();
  //   if (nodes.length === 0) {
  //     alert("Please generate a tree first!");
  //     return;
  //   }
  
  //   // Reset all node styles to default
  //   setNodes((prev) =>
  //     prev.map((node) => ({
  //       ...node,
  //       style: {
  //         ...node.style,
  //         background: "#b71c1c",
  //         color: "white",
  //       },
  //     }))
  //   );
  
  //   // Determine the traversal order
  //   const treeRoot = buildTree();
  //   let traversalOrder = [];
  //   if (type === "Preorder") {
  //     traversalOrder = preorderTraversal(treeRoot);
  //   } else if (type === "Inorder") {
  //     traversalOrder = inorderTraversal(treeRoot);
  //   } else if (type === "Postorder") {
  //     traversalOrder = postorderTraversal(treeRoot);
  //   }
  
  //   // Highlight nodes one by one based on traversal order
  //   let currentIndex = 0;
  //   traversalIntervalRef.current = setInterval(() => {
  //     if (currentIndex >= traversalOrder.length) {
  //       clearTraversal()
  //       return;
  //     }
  //     // change the previous node back to default color
  //     const prevNodeId = traversalOrder[currentIndex - 1]?.toString();
  //     const currentNodeId = traversalOrder[currentIndex].toString();
  
  //     setNodes((prev) =>
  //       prev.map((node) =>
  //         node.id === currentNodeId
  //           ? {
  //               ...node,
  //               style: {
  //                 ...node.style,
  //                 background: "#ff5722", // Highlight color
  //               },
  //             }
  //           : node
  //       )
  //     );
  //     setTraversalResult(traversalOrder.slice(0, currentIndex + 1).join(" -> "));
  //     currentIndex++;
  //   }, 1000);
  //   setIsTraversalModalOpen(false);
  // };

  const handleTraversalSelect = (type) => {
    clearTraversal();
    if (nodes.length === 0) {
      alert("Please generate a tree first!");
      return;
    }
  
    // Reset all node styles to default
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        style: {
          ...node.style,
          background: "#FFDE00", // Default color
          color: "black",
        },
      }))
    );
  
    // Determine the traversal order
    const treeRoot = buildTree();
    let traversalOrder = [];
    if (type === "Preorder") {
      traversalOrder = preorderTraversal(treeRoot);
    } else if (type === "Inorder") {
      traversalOrder = inorderTraversal(treeRoot);
    } else if (type === "Postorder") {
      traversalOrder = postorderTraversal(treeRoot);
    }
  
    // Highlight nodes one by one based on traversal order
    let currentIndex = 0;
    traversalIntervalRef.current = setInterval(() => {
      if (currentIndex >= traversalOrder.length) {
        clearTraversal()
        setTraversalResult(traversalOrder.join(" -> "));
        return;
      }
  
      const prevNodeId = traversalOrder[currentIndex - 1]?.toString(); // Previous node
      const currentNodeId = traversalOrder[currentIndex].toString();  // Current node
  
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === prevNodeId) {
            // Reset the previous node to its default color
            return {
              ...node,
              style: {
                ...node.style,
                background: "#FFDE00", // Default color
                color: "black",
              },
            };
          } else if (node.id === currentNodeId) {
            // Highlight the current node
            return {
              ...node,
              style: {
                ...node.style,
                background: "red", // Highlight color
                color: "black",
              },
            };
          }
          return node; // Leave other nodes unchanged
        })
      );
  
      setTraversalResult(traversalOrder.slice(0, currentIndex + 1).join(" -> "));
      currentIndex++;
    }, 1000);
  
    setIsTraversalModalOpen(false);
  };
  

  const handleChooseTraversal = () => {
    if (nodes.length === 0) {
      alert("Please generate a tree first!");
      return;
    }
    setIsTraversalModalOpen(true);
  };

  const handleLevelChange = (newLevel) => {
    clearTraversal(); 
    setLevels(newLevel);
  };


  return (
    <div className="w-full h-screen relative">
      {/* Modal for Levels */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-secondary-light p-6 rounded-lg shadow-lg w-96 text-center z-10">
            <h2 className="text-2xl font-bold mb-4">Enter Levels (1-5)</h2>
            <input
              type="number"
              value={levels}
              onChange={(e) =>
                handleLevelChange(Math.min(5, Math.max(1, +e.target.value)))
              }
              className="p-2 border border-dark bg-transparent rounded text-center w-24 mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
              min="1"
              max="5"
            />
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleGenerate}
                className="text-dark px-4 py-2 rounded shadow-md transition"
              >
                Generate Tree
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-delete text-dark px-4 py-2 rounded shadow-md hover:bg-red-400 transition"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Traversal Selection */}
      {isTraversalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-2xl font-bold mb-4">Choose Traversal Type</h2>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => handleTraversalSelect("Preorder")}
                className="bg-primary text-dark px-4 py-2 rounded hover:bg-primary-light transition"
              >
                Preorder (TLR)
              </Button>
              <Button
                onClick={() => handleTraversalSelect("Inorder")}
                className="bg-primary text-dark px-4 py-2 rounded  hover:bg-primary-light transition"
              >
                Inorder (LTR)
              </Button>
              <Button
                variant="primary"
                onClick={() => handleTraversalSelect("Postorder")}
                className="text-dark px-4 py-2 rounded hover:bg-primary-light transition"
              >
                Postorder (LRT)
              </Button>
              <Button
                variant="danger"
                onClick={() => setIsTraversalModalOpen(false)}
                className="text-dark px-4 py-2 rounded  hover:bg-red-400 transition"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-secondary-light text-center p-4 text-dark fixed top-0 z-10 w-full">
        <h1 className="text-xl font-bold">Binary Tree Traversal</h1>
      </div>

      {/* Tree */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes} // Register animated node type
        fitView
        onInit={setReactFlowInstance} // Capture the ReactFlow instance
        ref={reactFlowWrapper}
        className="w-full h-full bg-secondary-light"
        // image background
      >
        <Background className="bg-secondary" gap={16} variant="dots" lineWidth={0.3}/>
        <div className="absolute top-20 right-4">
          <Button
            onClick={handleChooseTraversal}
            variant="danger"
            className="text-dark px-4 py-2 rounded cursor-pointer bg-red-500 transition z-30"
          >
            Choose Traversal
          </Button>
        </div>
        <div className="bg-secondary absolute bottom-4 left-1/2 transform -translate-x-1/2  bg-opacity-80 py-2 flex justify-center min-w-[800px] w-[1400px]">
          <span className="block text-sm text-gray-800">
            {traversalResult || ""}
          </span>

        </div>
        <Controls showInteractive={false} />
      </ReactFlow>

      {/* Reopen Modal Button */}
      {!isModalOpen && (
        <div className="absolute z-10 top-20 right-44">
          <Button
          variant="primary"
            onClick={() => setIsModalOpen(true)}
            className=" text-dark px-4 py-2 rounded hover:bg-primary-light transition"
          >
            Edit Levels
          </Button>
        </div>
      )}
    </div>
  );
};

export default BinaryTreeTraversal;
