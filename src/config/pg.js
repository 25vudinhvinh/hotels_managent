const { Client } = require('pg');
const pg = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'hotel_management',
  });

pg.connect()

  async function getHotelsAndServices() {
      const query = `
        SELECT 
          h.hotel_id,
          h.name AS hotel_name,
          h.latitude,
          h.longitude,
          h.address,
          h.district,
          h.city,
          h.star,
          h.image,
          h.hotel_web,
          h.number_phone,
          h.price,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'service_name', s.service_name,
              'service_icon', s.service_icon
            )
          ) AS services
        FROM 
          hotels h
        LEFT JOIN 
          hotel_service hs ON h.hotel_id = hs.hotel_id
        LEFT JOIN 
          services s ON hs.service_id = s.service_id
        GROUP BY 
          h.hotel_id
        ORDER BY 
          h.hotel_id ASC
      `;
      const result = await pg.query(query);
      return result.rows    
  }
  


module.exports = { getHotelsAndServices}

