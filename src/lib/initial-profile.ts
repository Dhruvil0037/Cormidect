import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const initialProfile = async()=> {
	const user = await currentUser();

	if(!user){
		return redirect("/sign-in")
	}

	const userProfile = await db.user.findUnique({where:{
		userId:user.id
	}});

	if(!userProfile){
		const newUser = await db.user.create({
			data:{
				userId: user.id,
				name: `${user.firstName} ${user.lastName}`,
  			imageUrl: user.imageUrl,
  			email: user.emailAddresses[0].emailAddress
			}
		})
		return newUser;
	}
	return userProfile;

}