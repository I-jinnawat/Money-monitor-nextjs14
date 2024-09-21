import mongoose from"mongoose";

const DB =
	"mongodb://127.0.0.1:27017/";

const connectDB = async () => {
	console.log("connecting DB...");
	try {
		await mongoose.connect(DB);
		console.log("DB connected");
	} catch (error:unknown) {
		  if (error instanceof Error) {
              console.error(`Can't connect to DB: ${error.message}`);
            }
		
	}
};

export default  connectDB