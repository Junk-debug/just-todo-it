'use client';

import ConfirmFlow from '@/components/confirm-flow';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/adaptive-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useUpdateUser from '@/hooks/user/use-update-user';
import { User } from '@prisma/client';
import { toast } from 'sonner';
import { z } from 'zod';

const imageUrlSchema = z
  .string()
  .url()
  .regex(/\.(jpeg|jpg|png|gif|webp|svg)$/i, {
    message:
      'Must be a valid image URL ending with a supported extension (jpeg, jpg, png, gif, webp, svg).',
  });

export default function ProfileImage({
  image,
  initials,
}: {
  image: User['image'];
  initials: string;
}) {
  const { updateUser, isPending } = useUpdateUser({
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update profile image', {
        description: error.message,
      });
    },
    onSuccess: () => toast.success('Image updated successfully'),
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const image = formData.get('image') as string;

    const res = imageUrlSchema.safeParse(image);
    if (res.error) {
      toast.error(res.error.errors[0].message);
      return;
    }

    updateUser({ image });
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:flex-row justify-center items-center sm:justify-between">
      <Avatar className="size-44 sm:size-32">
        <AvatarImage src={image ?? undefined} alt="profile image" />
        <AvatarFallback>
          <span className="text-4xl">{initials}</span>
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-wrap gap-2">
        <Modal>
          <ModalTrigger asChild>
            <Button variant={'outline'}>
              {image ? 'Upload new image' : 'Upload image'}
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Upload new image</ModalTitle>
              <ModalDescription>Provide a link to an image</ModalDescription>
            </ModalHeader>
            <form
              className="flex flex-col gap-4 p-4 md:p-0"
              onSubmit={onSubmit}
            >
              <Label className="flex flex-col gap-2">
                Image URL
                <Input
                  defaultValue={image ?? ''}
                  required
                  type="url"
                  name="image"
                />
              </Label>
              <Button type="submit">Submit</Button>
            </form>
          </ModalContent>
        </Modal>
        <ConfirmFlow
          title="Are you sure?"
          description="Are you sure you want to delete your image?"
          trigger={<Button variant={'secondary'}>Delete image</Button>}
          confirmText="Yes, delete it"
          isLoading={isPending}
          onConfirm={() => updateUser({ image: null })}
        />
      </div>
    </div>
  );
}
