const API_BASE_URL = 'https://services.mizupass.com'

// Types for upload responses
export interface FileUploadResponse {
  success: boolean
  message?: string
  data?: {
    ipfsHash: string
    ipfsUrl: string
    fileName: string
    fileSize: number
    fileType: string
    pinataData: {
      IpfsHash: string
      PinSize: number
      Timestamp: string
    }
  }
  error?: string
}

export interface JsonUploadResponse {
  success: boolean
  message?: string
  data?: {
    ipfsHash: string
    ipfsUrl: string
    ipfsHashTicket: string
    ipfsUrlTicket: string
    pinataData?: {
      IpfsHash: string
      PinSize: number
      Timestamp: string
    }
  }
  error?: string
}

// NFT Metadata structure for events
export interface EventNFTMetadata {
  name: string
  description: string
  image: string
  external_url: string
  price: string
  location: string
  maxParticipants: string
  date: string
}

// Upload file to IPFS via Pinata
export const uploadFileToIPFS = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload/file`, {
      method: 'POST',
      body: formData,
    })

    const result: FileUploadResponse = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload file')
    }

    return result
  } catch (error) {
    console.error('File upload error:', error)
    throw error
  }
}

// Upload JSON metadata to IPFS via Pinata
export const uploadJSONToIPFS = async (metadata: EventNFTMetadata): Promise<JsonUploadResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/upload/json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    })

    const result: JsonUploadResponse = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload JSON metadata')
    }

    return result
  } catch (error) {
    console.error('JSON upload error:', error)
    throw error
  }
}

// Complete flow: Upload file first, then upload metadata with file CID
export const uploadEventNFTMetadata = async (
  eventData: {
    name: string
    description: string
    external_url: string
    price: number
    location: string
    maxParticipants: number
    date: number // Unix timestamp
    eventImage: File
  }
): Promise<{ imageCID: string; eventMetadataCID: string; ticketMetadataCID: string; metadataURL: string }> => {
  // Step 1: Upload image file
  console.log('Step 1: Uploading event image...')
  const fileUploadResult = await uploadFileToIPFS(eventData.eventImage)
  
  if (!fileUploadResult.success || !fileUploadResult.data) {
    throw new Error('Failed to upload event image')
  }

  const imageCID = fileUploadResult.data.ipfsHash
  const imageIPFSUrl = fileUploadResult.data.ipfsUrl

  // Step 2: Create NFT metadata - we'll update external_url after getting metadata URL
  console.log('Step 2: Uploading NFT metadata...')
  
  // First create metadata without external_url
  const tempMetadata: EventNFTMetadata = {
    name: eventData.name,
    description: eventData.description,
    image: imageIPFSUrl, // Use full IPFS URL for the uploaded image
    external_url: '', // Will be updated with metadata URL
    price: eventData.price.toString(), // Convert number to string for NFT metadata
    location: eventData.location,
    maxParticipants: eventData.maxParticipants.toString(),
    date: new Date(eventData.date * 1000).toISOString(), // Convert unix timestamp to ISO string
  }

  const jsonUploadResult = await uploadJSONToIPFS(tempMetadata)
  
  if (!jsonUploadResult.success || !jsonUploadResult.data) {
    throw new Error('Failed to upload NFT metadata')
  }

  const metadataURL = jsonUploadResult.data.ipfsUrl

  // Step 3: Upload final metadata with external_url pointing to metadata IPFS URL
  console.log('Step 3: Updating metadata with external_url...')
  const finalMetadata: EventNFTMetadata = {
    ...tempMetadata,
    external_url: metadataURL, // Use metadata IPFS URL as external_url
  }

  const finalJsonUploadResult = await uploadJSONToIPFS(finalMetadata)
  
  if (!finalJsonUploadResult.success || !finalJsonUploadResult.data) {
    throw new Error('Failed to upload final NFT metadata')
  }

  const eventMetadataCID = finalJsonUploadResult.data.ipfsHash
  const ticketMetadataCID = finalJsonUploadResult.data.ipfsHashTicket
  const finalMetadataURL = finalJsonUploadResult.data.ipfsUrl

  console.log('Upload complete!', { 
    imageCID, 
    eventMetadataCID, 
    ticketMetadataCID, 
    metadataURL: finalMetadataURL 
  })
  
  return {
    imageCID,
    eventMetadataCID,
    ticketMetadataCID,
    metadataURL: finalMetadataURL
  }
}