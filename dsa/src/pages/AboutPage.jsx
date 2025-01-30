import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGamepad, FaStackOverflow, FaListUl, FaTree, FaCodeBranch, FaHiking, FaSort } from "react-icons/fa";
import { path } from "framer-motion/client";

const AboutPage = () => {
  const navLinks = [
    {
      path: "/case1",
      name: "Tic-Tac-Toe",
      description: "A classic game of strategy for two players.",
      icon: <FaGamepad />,
      bgColor: "bg-yellow-400",
      hoverColor: "hover:bg-yellow-500",
    },
    {
      path: "/case2",
      name: "Stack",
      description: "Visualize how stacks work in data structures.",
      icon: <FaStackOverflow />,
      bgColor: "bg-blue-400",
      hoverColor: "hover:bg-blue-500",
    },
    {
      path: "/case3",
      name: "Queue",
      description: "Learn the basics of queue operations.",
      icon: <FaListUl />,
      bgColor: "bg-green-400",
      hoverColor: "hover:bg-green-500",
    },
    {
      path: "/case4",
      name: "Binary Tree",
      description: "Understand binary tree structures.",
      icon: <FaTree />,
      bgColor: "bg-orange-400",
      hoverColor: "hover:bg-orange-500",
    },
    {
      path: "/case5",
      name: "BST with Traversal",
      description: "Explore binary search trees and traversals.",
      icon: <FaCodeBranch />,
      bgColor: "bg-purple-400",
      hoverColor: "hover:bg-purple-500",
    },
    {
      path: "/case6",
      name: "Towers of Hanoi",
      description: "Solve the classic Towers of Hanoi puzzle.",
      icon: <FaHiking />,
      bgColor: "bg-red-400",
      hoverColor: "hover:bg-red-500",
    },
    {
      path: "/case7",
      name: "Sorting",
      description: "Learn about different sorting algorithms.",
      icon: <FaSort />,
      bgColor: "bg-yellow-400",
      hoverColor: "hover:bg-yellow-500",
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-light p-10">
      <motion.h1
        className="text-5xl font-extrabold text-center text-gray-800 mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Welcome to <span className="text-primary text-stroke">DSA Group 1 Case Study</span>
      </motion.h1>

      <motion.div
        className="flex flex-wrap justify-center gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {navLinks.map((link) => (
          <motion.div
            key={link.path}
            className={`group relative block border-black border rounded-lg shadow-lg p-2 transition transform hover:scale-105 ${link.bgColor} ${link.hoverColor}`}
            whileHover={{ rotate: [0, 3, -3, 3, 0], transition: { duration: 0.6 } }}
          >
            <Link to={link.path} className="flex flex-col items-center text-center">
              <motion.div
                className="text-dark text-5xl mb-4"
                whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
              >
                {link.icon}
              </motion.div>
              <h2 className="text-xl font-bold text-dark group-hover:text-white">
                {link.name}
              </h2>
              <p className="text-dark mt-2 group-hover:text-white">{link.description}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center mt-10">
        <motion.button
          whileHover={{
            scale: 1.1,
            backgroundColor: "#FFDE00",
            transition: { duration: 0.3 },
          }}
          className="px-6 py-3 bg-primary text-dark font-bold rounded-lg shadow-md hover:shadow-lg"
        >
          Explore All
        </motion.button>
      </div>
    </div>
  );
};

export default AboutPage;
