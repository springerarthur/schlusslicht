import Image from "next/image";
import Link from "next/link";

import { User } from "../lib/User";

export default function ProfileImage({
  user,
  size,
  className = "",
  linkToProfile = true,
}: {
  user: User;
  size: number;
  className?: string;
  linkToProfile?: boolean;
}) {
  const imageSrc = size <= 120 ? user.profileImgSmall : user.profileImg;

  if (linkToProfile) {
    return (
      <Link href={`/user/${user.garminUserId}`}>
        <Image
          src={imageSrc}
          width={size}
          height={size}
          className={"rounded-circle " + className}
          alt={user.displayName}
        />
      </Link>
    );
  } else {
    return (
      <Image
        src={imageSrc}
        width={size}
        height={size}
        className={"rounded-circle " + className}
        alt={user.displayName}
      />
    );
  }
}
