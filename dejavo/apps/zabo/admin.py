from django.contrib import admin
from django.template.defaultfilters import escape
from django.core.urlresolvers import reverse
from dejavo.apps.zabo.models import Article, Poster, Announcement, \
        Question, Answer, Attachment, Timeslot, Contact

import os

class ContactInline(admin.TabularInline):
    model = Contact
    extra = 0

class PosterInline(admin.TabularInline):
    model = Poster
    extra = 0
    readonly_fields = ('render_image',)

    def render_image(self, poster):
        print self.fields
        return '<img style="height:auto; width:auto; ' + \
                'max-width:60px; max-height:80px;" src="%s"/>' % poster.image.url

class TimeslotInline(admin.StackedInline):
    model = Timeslot
    extra = 0

class AttachmentInline(admin.StackedInline):
    model = Attachment
    extra = 0

class ArticleAdmin(admin.ModelAdmin):
    model = Article
    inlines = [ContactInline, PosterInline, AttachmentInline, TimeslotInline]
    list_display = ('id', 'title', 'category', 'get_owners', 'get_posters', 
            'get_attchments', 'created_date', 'updated_date')
    search_fields = ('title', 'owner__username')
    list_filter = ('category', 'created_date', 'updated_date')

    def get_posters(self, article):
        posters = list(Poster.objects.filter(article = article))
        return ' '.join(
                map(lambda x : '<img style="height:auto; width:auto; ' + \
                            'max-width:45px; max-height:60px;" src="%s"/>' \
                    % x.image.url, posters))
    get_posters.allow_tags = True
    get_posters.short_description = 'Poster'

    def get_attchments(self, article):
        attachs = list(Attachment.objects.filter(article = article))
        return '<br>'.join(
                map(lambda x : '<a href="%s">%s</a>' % \
                        (x.filepath.url,
                            escape(os.path.basename(x.filepath.file.name))),
                        attachs))
    get_attchments.allow_tags = True
    get_attchments.short_description = 'Attachment'

    def owner_link(self, user):
        return '<a href="%s"><b>%s</b></a>' % \
                (reverse("admin:auth_user_change", args=(user.id,)) , escape(user))

    def get_owners(self, article):
        owners = list(article.owner.all())
        return '<br>'.join(map(lambda x : self.owner_link(x), owners))
    get_owners.allow_tags = True
    get_owners.short_description = 'Owner'

class TimeslotAdmin(admin.ModelAdmin):
    model = Timeslot
    list_display = ('id', 'get_article', 'label', 'timeslot_type', 'start_time', 'end_time')
    search_fields = ('article__title', 'label')
    list_filter = ('timeslot_type', 'start_time', 'end_time')

    def get_article(self, t):
        return '<a href="%s"><b>%s</b></a>' % \
                (reverse("admin:zabo_article_change", args=(t.article.id,)),
                        escape(t.article.title))
    get_article.allow_tags = True
    get_article.short_description = 'Article'

class AnnouncementAdmin(admin.ModelAdmin):
    model = Announcement

class QuestionAdmin(admin.ModelAdmin):
    model = Question
    list_display = ('id', 'get_article', 'get_writer', 'get_short_content', 'created_date')
    search_fields = ('article__title', 'writer__username',)
    list_filter = ('created_date',)
    content_display_len = 50

    def writer_link(self, user):
        return '<a href="%s"><b>%s</b></a>' % \
                (reverse("admin:auth_user_change", args=(user.id,)) , escape(user))

    def get_writer(self, a):
        return self.writer_link(a.writer)
    get_writer.allow_tags = True
    get_writer.short_description = 'Writer'

    def get_short_content(self, q):
        return q.content[0:self.content_display_len] + '...' \
                if len(q.content) > self.content_display_len else q.content
    get_short_content.short_description = 'Short Content'

    def get_article(self, q):
        return '<a href="%s"><b>%s</b></a>' % \
                (reverse("admin:zabo_article_change", args=(q.article.id,)),
                        escape(q.article.title))
    get_article.allow_tags = True
    get_article.short_description = 'Article'

class AnswerAdmin(admin.ModelAdmin):
    model = Answer
    list_display = ('id', 'get_article', 'get_question', 'get_short_content',
            'get_writer', 'created_date')
    search_fields = ('question__article__title', 'writer__username',)
    list_filter = ('created_date',)
    content_display_len = 50

    def writer_link(self, user):
        return '<a href="%s"><b>%s</b></a>' % \
                (reverse("admin:auth_user_change", args=(user.id,)) , escape(user))

    def get_writer(self, a):
        return self.writer_link(a.writer)
    get_writer.allow_tags = True
    get_writer.short_description = 'Writer'

    def get_short_content(self, a):
        return a.content[0:self.content_display_len] + '...' \
                if len(a.content) > self.content_display_len else a.content
    get_short_content.short_description = 'Short Content'

    def get_question(self, a):
        return '<a href="%s"><b>%s</b></a>' % \
                (reverse("admin:zabo_question_change", args=(a.question.id,)),
                        escape(a.question.id))
    get_question.allow_tags = True
    get_question.short_description = 'Question'

    def get_article(self, a):
        return '<a href="%s"><b>%s</b></a>' % \
                (reverse("admin:zabo_article_change", args=(a.question.article.id,)),
                        escape(a.question.article.title))
    get_article.allow_tags = True
    get_article.short_description = 'Article'

admin.site.register(Article, ArticleAdmin)
admin.site.register(Timeslot, TimeslotAdmin)
admin.site.register(Announcement, AnnouncementAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
