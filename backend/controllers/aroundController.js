const getAroundPlaces = async (req,res)=>{
 try{

  const { lat, lng } = req.query

  if(!lat || !lng){
   return res.status(400).json({
    status:0,
    message:"Location required"
   })
  }

  const data = {
   parks:[
    { name:"City Park", distance:"1.2 km" },
    { name:"Green Garden", distance:"2 km" }
   ],

   cafes:[
    { name:"Cafe Coffee Day", distance:"800 m" },
    { name:"Brew Cafe", distance:"1.5 km" }
   ],

   restaurants:[
    { name:"Dominos", distance:"1 km" },
    { name:"KFC", distance:"2.2 km" }
   ],

   gameZones:[
    { name:"Fun City Gaming", distance:"1.3 km" },
    { name:"Arcade Arena", distance:"2.4 km" }
   ],

   hospitals:[
    { name:"Apollo Hospital", distance:"3 km" },
    { name:"City Care Hospital", distance:"2 km" }
   ]
  }

  res.status(200).json({
   status:1,
   data:data
  })

 }catch(error){

  res.status(500).json({
   status:0,
   message:"Error fetching nearby places"
  })

 }
}

module.exports = {
 getAroundPlaces
}