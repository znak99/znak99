from pathlib import Path
from PIL import Image, ImageOps

TARGET_WIDTH = 780
WEBP_QUALITY = 85

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def resize_and_convert(image_path: Path) -> None:
    """
    Resize image to TARGET_WIDTH while preserving aspect ratio,
    convert to WebP, and delete original file only after success.
    """
    output_path = image_path.with_suffix(".webp")

    try:
        with Image.open(image_path) as img:
            # EXIF 회전 정보 반영
            img = ImageOps.exif_transpose(img)

            original_width, original_height = img.size

            # 이미 가로가 780 이하라도 요구사항에 맞춰 780으로 맞춤
            new_width = TARGET_WIDTH
            new_height = int((original_height / original_width) * new_width)

            # PNG 투명도 유지, JPG는 RGB 변환
            if img.mode not in ("RGB", "RGBA"):
                if "transparency" in img.info:
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")

            resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            save_kwargs = {
                "format": "WEBP",
                "quality": WEBP_QUALITY,
                "method": 6,
            }

            # 알파 채널이 없으면 RGB로 정리
            if resized.mode not in ("RGB", "RGBA"):
                resized = resized.convert("RGB")

            resized.save(output_path, **save_kwargs)

        # 저장 성공 후 원본 삭제
        image_path.unlink()
        print(f"Converted: {image_path.name} -> {output_path.name} ({new_width}px)")

    except Exception as exc:
        print(f"Failed: {image_path.name} - {exc}")


def main() -> None:
    current_dir = Path(__file__).resolve().parent

    for item in current_dir.iterdir():
        if item.is_file() and item.suffix.lower() in SUPPORTED_EXTENSIONS:
            resize_and_convert(item)


if __name__ == "__main__":
    main()