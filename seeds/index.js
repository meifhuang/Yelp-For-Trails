//created just to add initial data to work with in the database

const mongoose = require('mongoose');
const Trail = require('../models/trail');
require("dotenv").config({ path: '../.env' });


console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('strictQuery', false)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection err:"));
db.once("open", () => {
    console.log("database connected");
})

const seedDB = async () => {
    await Trail.deleteMany({});
    const a = new Trail(
        {
            title: 'Skyline Trail',
            images: [
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/n24rgq5vxst71yhgdngk.png',
                  filename: 'YelpTrail/n24rgq5vxst71yhgdngk',
                },
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/w1fcyxz3b0max1wtu171.png',
                  filename: 'YelpTrail/w1fcyxz3b0max1wtu171',
                }
              ],
            location: 'Washington',
            difficulty: 'Strenuous',
            distance: 6.2,
            author: '64193db6b4186a18ce975e7e'
        });
    const b = new Trail(
        {
            title: 'Angels Landing',
            images: [
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/n24rgq5vxst71yhgdngk.png',
                  filename: 'YelpTrail/n24rgq5vxst71yhgdngk',
                },
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/w1fcyxz3b0max1wtu171.png',
                  filename: 'YelpTrail/w1fcyxz3b0max1wtu171',
                }
              ],
            location: 'Utah',
            difficulty: 'Strenuous',
            distance: 5.4,
            author: '64193db6b4186a18ce975e7e'
        });
    const c = new Trail(
        {
            title: 'Grinnell Glacier',
            images: [
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/n24rgq5vxst71yhgdngk.png',
                  filename: 'YelpTrail/n24rgq5vxst71yhgdngk',
                },
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/w1fcyxz3b0max1wtu171.png',
                  filename: 'YelpTrail/w1fcyxz3b0max1wtu171',
                }
              ],
            location: 'Montana',
            difficulty: 'Strenuous',
            distance: 10.6,
            author: '64193db6b4186a18ce975e7e'
        });
    const e = new Trail(
        {
            title: 'Half Dome',
            location: 'California',
            images: [
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/n24rgq5vxst71yhgdngk.png',
                  filename: 'YelpTrail/n24rgq5vxst71yhgdngk',
                },
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/w1fcyxz3b0max1wtu171.png',
                  filename: 'YelpTrail/w1fcyxz3b0max1wtu171',
                }
              ],
            difficulty: 'Extremely strenuous',
            distance: 7.2,
            author: '64193db6b4186a18ce975e7e'
        });

    const g = new Trail(
        {
            title: 'Notch Trail',
            images: [
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/n24rgq5vxst71yhgdngk.png',
                  filename: 'YelpTrail/n24rgq5vxst71yhgdngk',
                },
                {
                  url: 'https://res.cloudinary.com/dxq4m23dd/image/upload/v1679630520/YelpTrail/w1fcyxz3b0max1wtu171.png',
                  filename: 'YelpTrail/w1fcyxz3b0max1wtu171',
                }
              ],
            location: 'South Dakota',
            difficulty: 'Easy',
            distance: 1.5,
            author: '64193db6b4186a18ce975e7e'
        });

    await a.save();
    await b.save();
    await c.save();
    await e.save();
    await g.save();
}

seedDB().then(() => {
    mongoose.connection.close();
});
