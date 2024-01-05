import Image from "next/image";

import { User } from "../src/lib/User";
import Link from "next/link";

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
  if (linkToProfile) {
    return (
      <Link href={`/user/${user.garminUserId}`}>
        <Image
          src={user.profileImg}
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
        src={user.profileImg}
        width={size}
        height={size}
        className={"rounded-circle " + className}
        alt={user.displayName}
      />
    );
  }
}
