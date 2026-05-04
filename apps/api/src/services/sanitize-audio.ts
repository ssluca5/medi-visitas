const ID3V2_HEADER_SIZE = 10;

function stripId3Tags(buffer: Buffer): Buffer {
  // Strip ID3v2 tag from beginning
  let offset = 0;
  if (
    buffer.length >= 3 &&
    buffer[0] === 0x49 && // 'I'
    buffer[1] === 0x44 && // 'D'
    buffer[2] === 0x33 // '3'
  ) {
    // ID3v2 size is stored as 4 syncsafe bytes (bit 7 clear)
    const size =
      (buffer[6] << 21) | (buffer[7] << 14) | (buffer[8] << 7) | buffer[9];
    offset = ID3V2_HEADER_SIZE + size;
  }

  // Strip ID3v1 tag from end (last 128 bytes starting with "TAG")
  const end = buffer.length;
  let endOffset = end;
  if (end >= 128 && buffer.toString("ascii", end - 128, end - 125) === "TAG") {
    endOffset = end - 128;
  }

  if (offset > 0 || endOffset < end) {
    return buffer.subarray(offset, endOffset);
  }
  return buffer;
}

function stripWavMetadata(buffer: Buffer): Buffer {
  // WAV is RIFF container: [RIFF header][chunks...]
  // Keep only "fmt " and "data" chunks, discard metadata chunks (LIST, INFO, etc.)
  if (buffer.length < 44) return buffer;

  const riff = buffer.toString("ascii", 0, 4);
  if (riff !== "RIFF") return buffer;

  const wave = buffer.toString("ascii", 8, 12);
  if (wave !== "WAVE") return buffer;

  // Collect chunks we want to keep
  const dataChunks: Buffer[] = [];
  const fmtChunk: Buffer[] = [];
  let offset = 12;

  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkData = buffer.subarray(offset, offset + 8 + chunkSize);

    if (chunkId === "fmt " || chunkId === "data") {
      if (chunkId === "fmt ") {
        fmtChunk.push(chunkData);
      } else {
        dataChunks.push(chunkData);
      }
    }

    offset += 8 + chunkSize;
  }

  // Rebuild RIFF with only fmt + data chunks
  if (fmtChunk.length > 0) {
    const payload = Buffer.concat([...fmtChunk, ...dataChunks]);
    const fileSize = 4 + payload.length; // "WAVE" + chunks
    const header = Buffer.alloc(12);
    header.write("RIFF", 0, "ascii");
    header.writeUInt32LE(fileSize, 4);
    header.write("WAVE", 8, "ascii");
    return Buffer.concat([header, payload]);
  }

  return buffer;
}

export function sanitizeAudioBuffer(
  buffer: Buffer,
  mimeType: string,
): { buffer: Buffer; sanitized: boolean } {
  if (mimeType === "audio/mpeg") {
    const cleaned = stripId3Tags(buffer);
    return { buffer: cleaned, sanitized: cleaned.length < buffer.length };
  }
  if (mimeType === "audio/wav") {
    const cleaned = stripWavMetadata(buffer);
    return { buffer: cleaned, sanitized: cleaned.length < buffer.length };
  }
  // WebM, OGG, MP4 from browser MediaRecorder: no embedded location metadata
  return { buffer, sanitized: false };
}
