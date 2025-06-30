const express = require('express');
const aiService = require('../services/ai.service');


module.exports.getReview = async (req, res) => {
    const code = req.body.code;
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    try {
      console.log("calling gemini for response")
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
  