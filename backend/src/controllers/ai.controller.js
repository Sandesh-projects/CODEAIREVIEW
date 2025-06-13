const express = require('express');
const aiService = require('../services/ai.service');

// module.exports.getReview = async (req, res) => {
//     const code = req.body.code;
//     if (!code) {
//         return res.status(400).json({ error: 'Code is required' });
//     }
//     const response = await aiService.generateContent(code);
//     if (!response) {
//         return res.status(500).json({ error: 'Failed to generate content' });
//     }
//     res.send(response);
// }

module.exports.getReview = async (req, res) => {
    const code = req.body.code;
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    try {
      const response = await aiService.generateContent(code);
      if (!response) {
        return res.status(500).json({ error: 'Failed to generate content' });
      }
      res.json({ suggestion: response });
    } catch (error) {
      console.error("AI Review error:", error);
      res.status(500).json({ error: 'Unexpected error', details: error.message });
    }
  };
  