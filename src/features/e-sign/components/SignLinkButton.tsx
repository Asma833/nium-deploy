import React from "react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/clipboard";
import { LinkIcon } from "lucide-react";

interface SignLinkButtonProps {
  copyLinkUrl: string;
  buttonText: string;
}

export const SignLinkButton: React.FC<SignLinkButtonProps> = ({
  copyLinkUrl,
  buttonText,
}) => {
  const handleCopyLink = () => {
    copyToClipboard(copyLinkUrl, `${buttonText} link copied successfully!`);
  };

  return (
    <Button onClick={handleCopyLink} variant="outline" size="sm">
      <LinkIcon className="text-gray-500 cursor-pointer" />
    </Button>
  );
};
