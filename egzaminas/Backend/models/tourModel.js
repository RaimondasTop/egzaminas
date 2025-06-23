const { sql } = require("../dbConnection")

exports.createTour = async (newTour) => {
    const { name, description, price, duration, category, difficulty } = newTour;

    try {
        const tours = await sql`
            INSERT INTO tours (name, description, price, duration, category, difficulty) 
            VALUES (${name}, ${description}, ${price}, ${duration}, ${category}, ${difficulty})
            RETURNING *;
        `;
        return tours[0]; 
    } catch (error) {
        console.error('Error creating tour:', error);
        throw error; 
    }
};

exports.getAllTours = async () => {
    const tourList = await sql`
        SELECT 
            id,
            title, 
            description, 
            photo_url, 
            duration_minutes,
            price,
            average_rating,
            CASE 
                WHEN is_group_tour THEN 'Grupėms'
                ELSE 'Pavieniams'
            END AS category
        FROM tours
    `;

    return tourList;
};

exports.getTourByID = async (id) => {
    const tour = await sql`
        SELECT 
            id,
            title,
            description,
            photo_url,
            duration_minutes,
            price,
            average_rating,
            CASE 
                WHEN is_group_tour THEN 'Grupėms'
                ELSE 'Pavieniams'
            END AS category
        FROM tours
        WHERE id = ${id}
    `;

    return tour[0]; 
};


exports.updateTourPart = async (id, updatedTour) => {
    const columns = Object.keys(updatedTour);

    const upTour = await sql`
    update tours set ${sql(updatedTour, columns)}
    where id = ${id}
    RETURNING *;
    `;
    return upTour[0];
};

exports.filterTours = async (filter) => {
    const validDirections = ['ASC', 'DESC'];
    let sortDirection = 'ASC';

    if (filter.sort) {
        const upperSort = filter.sort.toUpperCase();
        if (validDirections.includes(upperSort)) {
            sortDirection = upperSort;
        }
    }

    const conditions = [];

    if (filter.duration) {
        conditions.push(`duration_minutes <= ${Number(filter.duration)}`);
    }

    if (filter.price) {
        conditions.push(`price <= ${Number(filter.price)}`);
    }

    if (filter.is_group_tour !== undefined) {
        conditions.push(`is_group_tour = ${filter.is_group_tour === 'true'}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const tours = await sql.unsafe(`
        SELECT 
            id,
            title,
            description,
            photo_url,
            duration_minutes,
            price,
            average_rating,
            CASE 
                WHEN is_group_tour THEN 'Grupėms'
                ELSE 'Pavieniams'
            END AS category
        FROM tours
        ${whereClause}
        ORDER BY price ${sortDirection};
    `);

    return tours;
};


