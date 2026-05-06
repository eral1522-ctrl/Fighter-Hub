import { Layout } from "@/components/layout";
import {
  useGetMyProfile,
  useCreateMyProfile,
  useUpdateMyProfile,
  useGetMyProfilePrefill,
  getGetMyProfileQueryKey,
  getGetMyProfilePrefillQueryKey,
} from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n";
import { Info } from "lucide-react";

const WEIGHT_CLASSES = [
  "Strawweight", "Light Flyweight", "Flyweight", "Super Flyweight", "Bantamweight",
  "Super Bantamweight", "Featherweight", "Super Featherweight", "Lightweight",
  "Super Lightweight", "Welterweight", "Super Welterweight", "Middleweight",
  "Super Middleweight", "Light Heavyweight", "Cruiserweight", "Heavyweight", "Super Heavyweight"
];

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  weightClass: z.string().min(2, "Weight class is required"),
  record: z.string().min(2, "Record is required (e.g. 15-2-0)"),
  age: z.coerce.number().optional().nullable(),
  height: z.string().optional().nullable(),
  stance: z.string().optional().nullable(),
  coach: z.string().optional().nullable(),
  manager: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email("Valid email required"),
  videoLinks: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  availableInternationally: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { t } = useLanguage();
  const p = t.profile;

  const { data: profile, isLoading, error } = useGetMyProfile({
    query: {
      queryKey: getGetMyProfileQueryKey(),
      retry: false,
    }
  });
  const isNewProfile = !!error && (error as any)?.status === 404;

  const { data: prefillData } = useGetMyProfilePrefill({
    query: { queryKey: getGetMyProfilePrefillQueryKey(), enabled: isNewProfile, retry: false },
  });

  const [prefillApplied, setPrefillApplied] = useState(false);

  const createProfile = useCreateMyProfile();
  const updateProfile = useUpdateMyProfile();
  const { toast } = useToast();
  const qc = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      country: "",
      city: "",
      weightClass: "",
      record: "",
      age: null,
      height: "",
      stance: "",
      coach: "",
      manager: "",
      instagram: "",
      whatsapp: "",
      email: "",
      videoLinks: "",
      bio: "",
      availableInternationally: false,
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        ...profile,
        age: profile.age || null,
        height: profile.height || "",
        stance: profile.stance || "",
        coach: profile.coach || "",
        manager: profile.manager || "",
        instagram: profile.instagram || "",
        whatsapp: profile.whatsapp || "",
        videoLinks: profile.videoLinks || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, form]);

  useEffect(() => {
    if (isNewProfile && prefillData && !prefillApplied) {
      form.reset({
        fullName: prefillData.name || "",
        email: prefillData.email || "",
        country: prefillData.country || "",
        city: "",
        weightClass: prefillData.weightClass || "",
        record: prefillData.record || "",
        age: null,
        height: "",
        stance: "",
        coach: "",
        manager: "",
        instagram: "",
        whatsapp: "",
        videoLinks: prefillData.boxrecLink || "",
        bio: prefillData.bio || "",
        availableInternationally: false,
      });
      setPrefillApplied(true);
    }
  }, [isNewProfile, prefillData, prefillApplied, form]);

  const onSubmit = (data: ProfileFormValues) => {
    const action = isNewProfile ? createProfile.mutateAsync : updateProfile.mutateAsync;

    action({ data }).then(() => {
      toast({ title: p.saved });
      qc.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
    }).catch((err: any) => {
      toast({
        title: p.saveError,
        description: err?.response?.data?.error || err?.message || "An error occurred",
        variant: "destructive",
      });
    });
  };

  const isSaving = createProfile.isPending || updateProfile.isPending;

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <div className="mb-8 border-b border-border pb-6">
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tight">{p.heading}</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-2xl">{p.description}</p>
        </div>

        {isNewProfile && prefillApplied && (
          <div className="mb-6 flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-md px-4 py-3">
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-primary/90">{p.prefilled}</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950 p-6 rounded-md border border-border">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="font-heading text-xl uppercase tracking-wider mb-4 border-b border-border/50 pb-2">{p.basicInfo}</h3>
                </div>

                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Full Name / Ring Name</FormLabel>
                    <FormControl><Input {...field} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Contact Email</FormLabel>
                    <FormControl><Input type="email" {...field} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Country</FormLabel>
                    <FormControl><Input {...field} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">City</FormLabel>
                    <FormControl><Input {...field} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Athletic Profile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950 p-6 rounded-md border border-border">
                <div className="col-span-1 md:col-span-3">
                  <h3 className="font-heading text-xl uppercase tracking-wider mb-4 border-b border-border/50 pb-2">{p.athleticProfile}</h3>
                </div>

                <FormField control={form.control} name="weightClass" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Weight Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background"><SelectValue placeholder="Select weight class" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WEIGHT_CLASSES.map((wc) => (
                          <SelectItem key={wc} value={wc}>{wc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="record" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Pro Record</FormLabel>
                    <FormControl><Input placeholder="W-L-D" {...field} className="bg-background font-mono text-center" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="stance" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Stance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="bg-background"><SelectValue placeholder="Select stance" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Orthodox">Orthodox</SelectItem>
                        <SelectItem value="Southpaw">Southpaw</SelectItem>
                        <SelectItem value="Switch">Switch</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Age</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value || ''} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="height" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Height</FormLabel>
                    <FormControl><Input placeholder='e.g. 6&apos;1"' {...field} value={field.value || ''} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Management & Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950 p-6 rounded-md border border-border">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="font-heading text-xl uppercase tracking-wider mb-4 border-b border-border/50 pb-2">{p.managementMedia}</h3>
                </div>

                <FormField control={form.control} name="coach" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Coach Name</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="manager" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Manager Name</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="instagram" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Instagram</FormLabel>
                    <FormControl><Input placeholder="@username" {...field} value={field.value || ''} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="whatsapp" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">WhatsApp Number</FormLabel>
                    <FormControl><Input placeholder="+1..." {...field} value={field.value || ''} className="bg-background" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="col-span-1 md:col-span-2">
                  <FormField control={form.control} name="videoLinks" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Videos & BoxRec (URLs)</FormLabel>
                      <FormControl><Textarea placeholder="YouTube/Vimeo links, BoxRec profile URL..." className="resize-none bg-background" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">Short Bio</FormLabel>
                      <FormControl><Textarea placeholder="Tell promoters why they should book you..." className="resize-none h-32 bg-background" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-background border border-border rounded-md">
                  <FormField control={form.control} name="availableInternationally" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-heading tracking-wide uppercase">International Availability</FormLabel>
                        <FormDescription>Are you willing and able to travel internationally for fights?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="font-heading uppercase tracking-wider font-bold w-full md:w-auto min-w-[200px]" disabled={isSaving}>
                  {isSaving ? p.saving : p.saveBtn}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </Layout>
  );
}
