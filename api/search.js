const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { type, faculty, startDateStart, startDateEnd } = req.body;

  // Mapping PTE Faculties to AIESEC Background IDs
  const MAP = {
    "Faculty of Business and Economics": [122, 124, 125, 127],
    "Faculty of Engineering and IT": [140, 145, 155],
    "Faculty of Humanities and Social Sciences": [130, 131, 132],
    "Faculty of Health Sciences": [160, 161],
    "Medical School": [160, 162],
    "Faculty of Law": [135, 136],
    "Faculty of Sciences": [170, 171, 172],
    "Faculty of Music and Visual Arts": [148, 149]
  };

  try {
    const response = await axios.get('https://opportunities-api.aiesec.org/v2/opportunities', {
      params: {
        access_token: process.env.AIESEC_TOKEN,
        "filters[programmes][]": type === "Global Talent" ? 2 : (type === "Global Teacher" ? 5 : 1),
        "filters[earliest_start_date]": startDateStart,
        "filters[latest_start_date]": startDateEnd,
        "per_page": 15
      }
    });

    const data = response.data.data.map(opp => {
      let score = 75; 
      const facultyIds = MAP[faculty] || [];
      const oppIds = opp.backgrounds ? opp.backgrounds.map(b => b.id) : [];
      if (facultyIds.some(id => oppIds.includes(id))) score += 20;

      return {
        id: opp.id,
        title: opp.title,
        location: opp.location,
        country: opp.host_lc.country,
        score: Math.min(score, 98),
        image: opp.cover_photo_urls?.medium,
        url: "https://aiesec.org/opportunity/" + opp.id
      };
    });

    res.status(200).json(data.sort((a, b) => b.score - a.score));
  } catch (e) {
    res.status(500).json({ error: "API connection failed" });
  }
};
