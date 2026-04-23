import Metadata from '../models/metadata.model';

export const fetchAllMetadata = async () => {
  return await Metadata.find();
};

export const createNewMetadata = async (data: any) => {
  const meta = new Metadata(data);
  return await meta.save();
};

export const updateMetadataById = async (id: string, name: string) => {
  return await Metadata.findByIdAndUpdate(id, { name }, { new: true });
};

export const deleteMetadataById = async (id: string) => {
  return await Metadata.findByIdAndDelete(id);
};
