"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Loader2, Star } from "lucide-react"
import { useQueryClient, useMutation } from "@tanstack/react-query"

const formSchema = z.object({
  dishName: z.string().min(1, "料理名を入力してください"),
  region: z.string().optional(),
  type: z.enum(["cooked", "eaten"]),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().optional(),
  date: z.string().min(1, "日付を入力してください"),
})

type FormValues = z.infer<typeof formSchema>

export default function FoodLogForm() {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dishName: "",
      region: "",
      type: "eaten",
      rating: 0,
      notes: "",
      date: new Date().toISOString().split("T")[0],
    },
  })

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          rating: rating || undefined,
          date: new Date(values.date).toISOString(),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "記録の追加に失敗しました")
      }
      return res.json()
    },
    onSuccess: () => {
      toast({ title: "記録を追加しました" })
      queryClient.invalidateQueries({ queryKey: ["/api/logs"] })
      setOpen(false)
      form.reset()
      setRating(0)
    },
    onError: (error: Error) => {
      toast({ title: "エラー", description: error.message, variant: "destructive" })
    },
  })

  const onSubmit = (values: FormValues) => {
    createMutation.mutate({ ...values, rating })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-log">
          <Plus className="h-4 w-4 mr-2" />
          記録を追加
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-add-log">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>食事を記録する</DialogTitle>
            <DialogDescription>
              食べた料理や作った料理を記録しましょう
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dishName">料理名 *</Label>
              <Input
                id="dishName"
                placeholder="例: カルボナーラ"
                {...form.register("dishName")}
                data-testid="input-dish-name"
              />
              {form.formState.errors.dishName && (
                <p className="text-sm text-destructive">{form.formState.errors.dishName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">地域・国</Label>
              <Input
                id="region"
                placeholder="例: イタリア"
                {...form.register("region")}
                data-testid="input-region"
              />
            </div>

            <div className="space-y-2">
              <Label>種類</Label>
              <div className="flex gap-4">
                {(["eaten", "cooked"] as const).map((t) => (
                  <label
                    key={t}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={t}
                      {...form.register("type")}
                      data-testid={`radio-type-${t}`}
                    />
                    <span>{t === "eaten" ? "食べた" : "作った"}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>評価</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star === rating ? 0 : star)}
                    data-testid={`button-star-${star}`}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= rating
                          ? "fill-chart-4 text-chart-4"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">日付 *</Label>
              <Input
                id="date"
                type="date"
                {...form.register("date")}
                data-testid="input-date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">メモ</Label>
              <Textarea
                id="notes"
                placeholder="感想や気づいたことなど"
                rows={2}
                {...form.register("notes")}
                data-testid="textarea-notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="button-cancel-log"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              data-testid="button-submit-log"
            >
              {createMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />保存中...</>
              ) : "記録する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
