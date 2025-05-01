'use server'

export default async function POST(req, res) {
    // if (req.method !== 'POST') {
    //     res.status(405)
    //     res.end();
    //     return
    // }
    
    res.status(200).json({message: 'YOOO'});
}