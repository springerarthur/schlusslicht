import Image from "next/image";

import IUser from "../lib/IUser";

export default function ProfileImage({
  user,
  size,
  className = "",
}: {
  user: IUser;
  size: number;
  className?: string;
}) {
  return (
    <Image
      src={user.profileImg}
      width={size}
      height={size}
      className={"rounded-circle " + className}
      alt={user.displayName}
    />
  );
}
