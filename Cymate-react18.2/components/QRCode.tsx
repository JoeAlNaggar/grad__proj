import Image from "next/image"

export default function QRCode() {
  return (
    <div className="relative w-64 h-64">
      <Image src="/dummy-qr-code.png" alt="Portfolio QR Code" layout="fill" objectFit="contain" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image src="/cymate-logo.png" alt="CyMate Logo" width={40} height={40} />
      </div>
    </div>
  )
}
